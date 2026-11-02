/**
 * Universal Media Provider Resolver
 * Detects media type and provider (YouTube, Vimeo, Direct MP4/WebM, Local, External Image)
 * and formats privacy-friendly embeds and fallback posters.
 */

export type MediaProvider =
  | 'youtube'
  | 'vimeo'
  | 'direct-video'
  | 'local-video'
  | 'image'
  | 'local-image'
  | 'unknown';

export interface ResolvedMedia {
  provider: MediaProvider;
  originalUrl: string;
  isEmbeddable: boolean;
  isVideo: boolean;
  isImage: boolean;
  videoId?: string;
  embedUrl?: string;
  posterFallbackUrl?: string;
  providerLabel: string;
}

export function resolveMediaUrl(url: string | null | undefined): ResolvedMedia {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      provider: 'unknown',
      originalUrl: '',
      isEmbeddable: false,
      isVideo: false,
      isImage: false,
      providerLabel: 'Empty',
    };
  }

  const cleanUrl = url.trim();

  // 1. YouTube URLs (watch, share, shorts, embed)
  const ytMatch =
    cleanUrl.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
    );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      provider: 'youtube',
      originalUrl: cleanUrl,
      isEmbeddable: true,
      isVideo: true,
      isImage: false,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`,
      posterFallbackUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      providerLabel: 'YouTube Video',
    };
  }

  // 2. Vimeo URLs
  const vimeoMatch = cleanUrl.match(
    /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)|player\.vimeo\.com\/video\/(\d+))/i
  );
  if (vimeoMatch && (vimeoMatch[1] || vimeoMatch[2])) {
    const videoId = vimeoMatch[1] || vimeoMatch[2];
    return {
      provider: 'vimeo',
      originalUrl: cleanUrl,
      isEmbeddable: true,
      isVideo: true,
      isImage: false,
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1&app_id=122963`,
      providerLabel: 'Vimeo Video',
    };
  }

  // 3. Local Video Assets (/assets/videos/... or /assets/uploads/...mp4)
  if (
    cleanUrl.startsWith('/') &&
    (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(cleanUrl) || cleanUrl.includes('/videos/'))
  ) {
    return {
      provider: 'local-video',
      originalUrl: cleanUrl,
      isEmbeddable: true,
      isVideo: true,
      isImage: false,
      embedUrl: cleanUrl,
      providerLabel: 'Local Video',
    };
  }

  // 4. Local Image Assets (/assets/images/... or /assets/uploads/...png)
  if (
    cleanUrl.startsWith('/') &&
    (/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(cleanUrl) || cleanUrl.includes('/images/'))
  ) {
    return {
      provider: 'local-image',
      originalUrl: cleanUrl,
      isEmbeddable: true,
      isVideo: false,
      isImage: true,
      embedUrl: cleanUrl,
      providerLabel: 'Local Image',
    };
  }

  // 5. Direct Video URLs (MP4, WebM, Supabase video, etc.)
  if (
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(cleanUrl) ||
    cleanUrl.includes('/portfolio-media/') ||
    cleanUrl.includes('supabase.co/storage/v1/object/public/portfolio-media')
  ) {
    return {
      provider: 'direct-video',
      originalUrl: cleanUrl,
      isEmbeddable: true,
      isVideo: true,
      isImage: false,
      embedUrl: cleanUrl,
      providerLabel: cleanUrl.includes('supabase.co') ? 'Supabase Video' : 'Direct MP4/WebM',
    };
  }

  // 6. Direct Images (JPG, PNG, WebP, SVG, Supabase posters, etc.)
  if (
    /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(cleanUrl) ||
    cleanUrl.includes('/portfolio-posters/') ||
    cleanUrl.includes('supabase.co/storage/v1/object/public/portfolio-posters')
  ) {
    return {
      provider: 'image',
      originalUrl: cleanUrl,
      isEmbeddable: true,
      isVideo: false,
      isImage: true,
      embedUrl: cleanUrl,
      providerLabel: cleanUrl.includes('supabase.co') ? 'Supabase Image' : 'External Image',
    };
  }

  // 7. Generic HTTPS Link (Could be dynamic CDN image, ImgHippo, Unsplash without extension, etc.)
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return {
      provider: 'image',
      originalUrl: cleanUrl,
      isEmbeddable: true,
      isVideo: false,
      isImage: true,
      embedUrl: cleanUrl,
      providerLabel: 'Web Asset URL',
    };
  }

  return {
    provider: 'unknown',
    originalUrl: cleanUrl,
    isEmbeddable: false,
    isVideo: false,
    isImage: false,
    providerLabel: 'Unknown URL',
  };
}

