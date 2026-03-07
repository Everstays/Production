import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label: string;
  onClick: () => void;
  /** Optional extra class for the button (e.g. mb-8). Position is always top-left. */
  className?: string;
}

/**
 * Shared back control: same position (top-left of content) and style across pages.
 * Each page should pass a unique label (e.g. "Back to Home", "Back to offers").
 */
export default function BackButton({ label, onClick, className = '' }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`inline-flex items-center gap-2 text-neutral-charcoal hover:text-primary-coral transition-colors mb-6 cursor-pointer ${className}`.trim()}
      aria-label={label}
    >
      <ArrowLeft className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
