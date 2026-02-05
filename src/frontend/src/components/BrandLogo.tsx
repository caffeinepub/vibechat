import { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16'
  };

  if (imageError) {
    return (
      <span
        className={`font-bold text-primary ${
          size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-4xl'
        } ${className}`}
      >
        vibechat
      </span>
    );
  }

  return (
    <img
      src="/assets/generated/vibechat-logo.dim_512x512.png"
      alt="vibechat"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
