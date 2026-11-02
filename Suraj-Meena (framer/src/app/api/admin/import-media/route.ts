import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSessionToken } from '@/lib/auth';

// SSRF Protection: Reject private/local IP hostnames
function isPrivateHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  // IPv4 private ranges
  const ipv4Match = lower.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const octet1 = parseInt(ipv4Match[1], 10);
    const octet2 = parseInt(ipv4Match[2], 10);

    // 10.0.0.0/8
    if (octet1 === 10) return true;
    // 127.0.0.0/8
    if (octet1 === 127) return true;
    // 172.16.0.0/12
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true;
    // 192.168.0.0/16
    if (octet1 === 192 && octet2 === 168) return true;
    // 169.254.0.0/16 (Link local / AWS metadata)
    if (octet1 === 169 && octet2 === 254) return true;
    // 0.0.0.0
    if (octet1 === 0) return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  // 1. Authenticate Admin Session
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const rawUrl = body.url ? String(body.url).trim() : '';
    const preferredBucket = body.bucket === 'portfolio-media' ? 'portfolio-media' : 'portfolio-posters';

    if (!rawUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // 2. Protocol Validation (HTTPS only)
    if (!rawUrl.startsWith('https://')) {
      return NextResponse.json(
        { error: 'Only secure HTTPS URLs can be imported to Supabase.' },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
    }

    // 3. SSRF Protection
    if (isPrivateHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: 'Cannot import from private, local, or loopback network addresses.' },
        { status: 403 }
      );
    }

    // 4. Fetch the external resource with 12s timeout and browser-like user agent
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let fetchRes = await fetch(rawUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,video/*,*/*;q=0.8',
      },
    });

    clearTimeout(timeout);

    let contentType = fetchRes.headers.get('content-type') || '';

    // 5. Special Host Handler: If an HTML viewer page is returned (e.g. ImgHippo or similar image sharing host)
    if (contentType.includes('text/html')) {
      const htmlText = await fetchRes.text();
      // Extract direct og:image or twitter:image
      const ogMatch =
        htmlText.match(/<meta\s+(?:property|name)=["'](?:og:image|twitter:image)["']\s+content=["']([^"']+)["']/i) ||
        htmlText.match(/content=["']([^"']+)["']\s+(?:property|name)=["'](?:og:image|twitter:image)["']/i);

      if (ogMatch && ogMatch[1] && ogMatch[1].startsWith('https://')) {
        const directImageUrl = ogMatch[1];
        try {
          const directController = new AbortController();
          const directTimeout = setTimeout(() => directController.abort(), 10000);

          const directRes = await fetch(directImageUrl, {
            signal: directController.signal,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Referer: rawUrl,
            },
          });
          clearTimeout(directTimeout);

          if (directRes.ok && directRes.headers.get('content-type')?.startsWith('image/')) {
            fetchRes = directRes;
            contentType = directRes.headers.get('content-type') || '';
          } else {
            return NextResponse.json(
              {
                error: `This page (${parsedUrl.hostname}) is an HTML viewer link. The underlying image host returned HTTP ${directRes.status} (hotlink protected or origin down). Please download the image and use the "Upload Directly" button.`,
              },
              { status: 422 }
            );
          }
        } catch {
          return NextResponse.json(
            {
              error: `The image host (${parsedUrl.hostname}) returned an HTML preview page rather than direct image bytes, and its storage CDN is unreachable. Please download the file to your computer and use "Upload Directly".`,
            },
            { status: 422 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: `The provided URL returned a webpage (HTML), not a direct image or video file. Please copy the direct image link or use "Upload Directly".`,
          },
          { status: 422 }
        );
      }
    }

    if (!fetchRes.ok) {
      return NextResponse.json(
        { error: `Remote server returned HTTP error ${fetchRes.status}: ${fetchRes.statusText}` },
        { status: 400 }
      );
    }

    // 6. Size and Type Validation
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Limit: 25MB for images, 50MB for videos
    const isVideo = contentType.startsWith('video/') || preferredBucket === 'portfolio-media';
    const maxSize = isVideo ? 50 * 1024 * 1024 : 25 * 1024 * 1024;

    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: `File too large (${(buffer.length / 1024 / 1024).toFixed(1)}MB). Max allowed is ${isVideo ? '50MB' : '25MB'}.` },
        { status: 400 }
      );
    }

    // Determine extension
    let extension = 'jpg';
    if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('webp')) extension = 'webp';
    else if (contentType.includes('gif')) extension = 'gif';
    else if (contentType.includes('svg')) extension = 'svg';
    else if (contentType.includes('mp4')) extension = 'mp4';
    else if (contentType.includes('webm')) extension = 'webm';
    else {
      const urlExtMatch = parsedUrl.pathname.match(/\.([a-zA-Z0-9]{3,4})$/);
      if (urlExtMatch) extension = urlExtMatch[1].toLowerCase();
    }

    const safeFileName = `imported-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
    let publicUrl = `/assets/uploads/${safeFileName}`;

    // 7. Upload to Supabase Storage Bucket
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      const { data, error: uploadErr } = await supabaseAdmin.storage
        .from(preferredBucket)
        .upload(`imported/${safeFileName}`, buffer, {
          contentType: contentType || (isVideo ? 'video/mp4' : 'image/jpeg'),
          upsert: true,
        });

      if (!uploadErr && data) {
        const { data: urlData } = supabaseAdmin.storage
          .from(preferredBucket)
          .getPublicUrl(`imported/${safeFileName}`);

        if (urlData?.publicUrl) {
          publicUrl = urlData.publicUrl;
        }
      }
    }

    // 8. Always write to local uploads directory as a dependable fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'assets', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadsDir, safeFileName), buffer);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      bucket: preferredBucket,
      originalUrl: rawUrl,
      size: buffer.length,
      contentType,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Failed to import external asset to Supabase Storage.', details: errorMsg },
      { status: 500 }
    );
  }
}

