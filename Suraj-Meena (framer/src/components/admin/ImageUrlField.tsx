'use client';

import React from 'react';
import { MediaUrlField } from './MediaUrlField';

interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  bucket?: 'portfolio-posters' | 'portfolio-media';
}

export const ImageUrlField: React.FC<ImageUrlFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  bucket = 'portfolio-posters',
}) => {
  return (
    <MediaUrlField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      helperText={helperText}
      mediaType="image"
      bucket={bucket}
      allowUpload={true}
      allowImport={true}
    />
  );
};
