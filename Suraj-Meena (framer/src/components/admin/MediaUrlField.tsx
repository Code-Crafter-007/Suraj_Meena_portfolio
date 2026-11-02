'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  AlertCircle,
  CheckCircle,
  Upload,
  CloudDownload,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { resolveMediaUrl } from '@/lib/mediaResolver';

interface MediaUrlFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  mediaType?: 'image' | 'video' | 'any';
  allowUpload?: boolean;
  allowImport?: boolean;
  bucket?: 'portfolio-posters' | 'portfolio-media';
  projectSlug?: string;
}

export const MediaUrlField: React.FC<MediaUrlFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  mediaType = 'image',
  allowUpload = true,
  allowImport = true,
  bucket,
  projectSlug,
}) => {
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resolved = resolveMediaUrl(value);

  const hasValue = Boolean(value && value.trim());
  const isExternalHttps = hasValue && value.startsWith('https://') && !value.includes('supabase.co');

  const defaultBucket = bucket || (mediaType === 'video' ? 'portfolio-media' : 'portfolio-posters');

  // Derive effective status without cascading effect renders
  const effectiveState = !hasValue
    ? 'idle'
    : resolved.provider === 'youtube' || resolved.provider === 'vimeo'
      ? 'success'
      : previewStatus;

  // Handle direct file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', defaultBucket);
      formData.append('register', 'false');
      if (projectSlug) formData.append('projectSlug', projectSlug);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        setPreviewStatus('success');
      } else {
        setErrorMessage(data.error || 'Upload failed');
        setPreviewStatus('error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || 'Upload failed');
      setPreviewStatus('error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle importing an external URL to Supabase Storage
  const handleImportToSupabase = async () => {
    if (!value || !value.startsWith('https://')) return;

    setImporting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/import-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: value,
          bucket: defaultBucket,
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        setPreviewStatus('success');
      } else {
        setErrorMessage(data.error || 'Failed to import media to Supabase');
        setPreviewStatus('error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || 'Import failed');
      setPreviewStatus('error');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 6,
        }}
      >
        <label
          style={{
            fontSize: '0.825rem',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          {label}
        </label>

        {hasValue && resolved.provider !== 'unknown' && (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 6,
              backgroundColor: resolved.provider === 'youtube'
                ? 'rgba(239, 68, 68, 0.15)'
                : resolved.provider === 'vimeo'
                ? 'rgba(14, 165, 233, 0.15)'
                : 'rgba(255, 255, 255, 0.08)',
              color: resolved.provider === 'youtube'
                ? '#f87171'
                : resolved.provider === 'vimeo'
                ? '#38bdf8'
                : 'rgba(255, 255, 255, 0.65)',
            }}
          >
            {resolved.providerLabel}
          </span>
        )}
      </div>

      {/* Input Row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setErrorMessage(null);
              setPreviewStatus('loading');
              onChange(e.target.value);
            }}
            placeholder={
              placeholder ||
              (mediaType === 'video'
                ? 'https://youtube.com/..., https://...mp4, or /assets/videos/...'
                : 'https://... or /assets/images/...')
            }
            style={{
              width: '100%',
              height: '100%',
              minHeight: 42,
              backgroundColor: '#121216',
              border:
                effectiveState === 'error'
                  ? '1px solid rgba(239, 68, 68, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 8,
              padding: '8px 14px',
              paddingRight: hasValue ? 36 : 14,
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
            }}
          />

          {hasValue && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setErrorMessage(null);
                setPreviewStatus('idle');
              }}
              title="Clear Field"
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Upload Button */}
        {allowUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === 'video' ? 'video/mp4,video/webm,video/*' : 'image/*'}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Upload file directly from computer to Supabase"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0 14px',
                height: 42,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: uploading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.2s ease',
              }}
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              <span>{uploading ? 'Uploading...' : 'Upload'}</span>
            </button>
          </>
        )}

        {/* Import External URL to Supabase Button */}
        {allowImport && isExternalHttps && (
          <button
            type="button"
            onClick={handleImportToSupabase}
            disabled={importing}
            title="Download external asset and save permanently in your Supabase Storage"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 14px',
              height: 42,
              borderRadius: 8,
              backgroundColor: 'rgba(59, 130, 246, 0.18)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              color: '#60a5fa',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: importing ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.2s ease',
            }}
          >
            {importing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CloudDownload size={14} />
            )}
            <span>{importing ? 'Importing...' : 'Import to Supabase'}</span>
          </button>
        )}
      </div>

      {/* Helper text & validation status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 6,
          fontSize: '0.75rem',
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
          {helperText || 'Direct link, external URL, or local path'}
        </span>

        {effectiveState === 'success' && (
          <span
            style={{
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 600,
            }}
          >
            <CheckCircle size={12} /> Valid Media
          </span>
        )}

        {effectiveState === 'loading' && (
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Loader2 size={12} className="animate-spin" /> Checking preview...
          </span>
        )}

        {effectiveState === 'error' && (
          <span
            style={{
              color: '#f87171',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 500,
            }}
          >
            <AlertCircle size={12} /> Unable to load preview
          </span>
        )}
      </div>

      {/* Error explanation banner */}
      {errorMessage && (
        <div
          style={{
            marginTop: 8,
            padding: '8px 12px',
            borderRadius: 6,
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5',
            fontSize: '0.75rem',
            lineHeight: 1.4,
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Live Preview Stage */}
      {hasValue && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 8,
            backgroundColor: '#0a0a0d',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* 1. YouTube Live Embed Preview */}
          {resolved.provider === 'youtube' && resolved.embedUrl && (
            <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 6, overflow: 'hidden' }}>
              <iframe
                src={resolved.embedUrl}
                title="YouTube Preview"
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* 2. Vimeo Live Embed Preview */}
          {resolved.provider === 'vimeo' && resolved.embedUrl && (
            <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 6, overflow: 'hidden' }}>
              <iframe
                src={resolved.embedUrl}
                title="Vimeo Preview"
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* 3. Direct / Local Video Preview */}
          {(resolved.provider === 'direct-video' || resolved.provider === 'local-video') && (
            <div style={{ position: 'relative', width: '100%', maxHeight: 200, borderRadius: 6, overflow: 'hidden', backgroundColor: '#000' }}>
              <video
                src={value}
                controls
                preload="metadata"
                style={{ width: '100%', maxHeight: 200, display: 'block', objectFit: 'contain' }}
                onLoadedData={() => {
                  setPreviewStatus('success');
                  setErrorMessage(null);
                }}
                onError={() => {
                  setPreviewStatus('error');
                  setErrorMessage('Failed to decode video file. Check that the URL is a direct MP4/WebM file or try uploading directly.');
                }}
              />
            </div>
          )}

          {/* 4. Image Preview */}
          {(resolved.isImage || (!resolved.isVideo && mediaType !== 'video')) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 6,
                  overflow: 'hidden',
                  backgroundColor: '#16161c',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt="Live Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: effectiveState === 'error' ? 'none' : 'block',
                  }}
                  onLoad={() => {
                    setPreviewStatus('success');
                    setErrorMessage(null);
                  }}
                  onError={() => {
                    setPreviewStatus('error');
                    setErrorMessage(
                      value.includes('imghippo.com')
                        ? 'This ImgHippo link is an HTML webpage rather than direct image bytes, and hotlinking is blocked by the host. Please click "Upload" to upload the image directly.'
                        : 'Image failed to load. The host may block direct hotlinking, or the URL might be invalid. Use "Upload" to host it directly.'
                    );
                  }}
                />

                {effectiveState === 'error' && (
                  <AlertCircle size={20} color="#f87171" />
                )}
                {effectiveState === 'loading' && (
                  <Loader2 size={16} className="animate-spin" color="rgba(255,255,255,0.4)" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: 2 }}>
                  {effectiveState === 'success' ? 'Preview Ready' : effectiveState === 'loading' ? 'Loading Image...' : 'Preview Error'}
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {value}
                </div>
              </div>

              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                title="Open asset in new tab"
                style={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  padding: 6,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

