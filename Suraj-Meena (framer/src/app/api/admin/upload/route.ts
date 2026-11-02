import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSessionToken } from '@/lib/auth';
import { saveMedia } from '@/lib/cms';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const caption = (formData.get('caption') as string) || '';
    const projectSlug = (formData.get('projectSlug') as string) || '';
    const registerInGallery = formData.get('register') !== 'false';
    const explicitBucket = formData.get('bucket') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isVideo = file.type.startsWith('video/');
    const bucket = explicitBucket || (isVideo ? 'portfolio-media' : 'portfolio-posters');

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    let publicUrl = `/assets/uploads/${safeName}`;

    // Upload to Supabase Storage using Service Role for authenticated backend admin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(`uploads/${safeName}`, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(`uploads/${safeName}`);
        if (urlData?.publicUrl) {
          publicUrl = urlData.publicUrl;
        }
      }
    }

    // Always persist to local uploads directory as reliable fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'assets', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadsDir, safeName), buffer);

    const mediaType = isVideo ? 'video' : 'image';

    // Optionally register in media gallery (if not a standalone thumbnail/logo upload)
    let mediaRecord = null;
    if (registerInGallery) {
      mediaRecord = await saveMedia({
        fileName: file.name,
        fileUrl: publicUrl,
        mediaType,
        caption: caption || file.name,
        projectSlug,
      });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media: mediaRecord,
      bucket,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'File upload failed', details: String(err) },
      { status: 500 }
    );
  }
}
