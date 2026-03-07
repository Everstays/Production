import { useState, useEffect, useRef } from 'react';

export interface AppImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  /** Container class (e.g. aspect ratio). Default: w-full h-full */
  containerClassName?: string;
  /** No border/rounded on image – soft fill only */
  noBorder?: boolean;
}

/** Shared no-image placeholder (icon + text) */
function NoImagePlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-neutral-border-gray/30 text-neutral-medium-gray ${className}`}
      aria-hidden
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/80 rounded-lg mb-2">
        <span className="text-3xl sm:text-4xl" role="img" aria-label="No image">
          🖼️
        </span>
      </div>
      <span className="text-caption font-medium">No image</span>
    </div>
  );
}

const LOAD_TIMEOUT_MS = 12000;

/**
 * Global app image: shimmer only while loading; then show image or "no image" placeholder.
 * Use for property/experience/offer images. No hard borders on the image.
 */
export default function AppImage({
  src,
  alt,
  className = '',
  containerClassName = 'w-full h-full',
  noBorder = true,
}: AppImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(() =>
    src && src.trim() ? 'loading' : 'error'
  );
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src || !src.trim()) {
      setStatus('error');
      return;
    }
    setStatus('loading');
  }, [src]);

  // Handle cached image (onLoad may have fired before we attached the listener)
  useEffect(() => {
    if (!src?.trim() || status !== 'loading') return;
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setStatus('loaded');
      return;
    }
    const checkComplete = () => {
      if (imgRef.current?.complete && (imgRef.current.naturalWidth > 0 || imgRef.current.naturalHeight > 0)) {
        setStatus('loaded');
      }
    };
    const t = setTimeout(checkComplete, 50);
    return () => clearTimeout(t);
  }, [src, status]);

  // Timeout: if still loading after LOAD_TIMEOUT_MS, show placeholder
  useEffect(() => {
    if (!src?.trim() || status !== 'loading') return;
    const timeout = setTimeout(() => setStatus('error'), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [src, status]);

  const showPlaceholder = !src || !src.trim() || status === 'error';
  const showShimmer = status === 'loading';

  if (showPlaceholder) {
    return (
      <div className={`${containerClassName} overflow-hidden ${noBorder ? '' : 'rounded-lg'}`}>
        <NoImagePlaceholder className={containerClassName} />
      </div>
    );
  }

  return (
    <div className={`relative ${containerClassName} overflow-hidden ${noBorder ? '' : 'rounded-lg'}`}>
      {showShimmer && (
        <div
          className="absolute inset-0 app-image-shimmer z-10"
          aria-hidden
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </div>
  );
}

export { NoImagePlaceholder };
