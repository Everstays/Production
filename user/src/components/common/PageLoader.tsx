import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  /** Show as full-screen overlay (default) or inline */
  fullScreen?: boolean;
}

export default function PageLoader({ fullScreen = true }: PageLoaderProps) {
  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm'
          : 'flex items-center justify-center py-12'
      }
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-coral animate-spin" aria-hidden />
        <p className="text-body text-neutral-medium-gray font-medium">Loading...</p>
      </div>
    </div>
  );
}
