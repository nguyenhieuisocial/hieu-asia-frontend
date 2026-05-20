import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Props {
  title: string;
  step?: string;
  backTo?: string;
}

/**
 * Mobile-native top bar. Use zmp-ui `Header` once SDK is available;
 * for V1 we render a minimal styled header so dev preview works in any browser.
 */
export function ZaloHeader({ title, step, backTo }: Props) {
  const navigate = useNavigate();
  return (
    <header className="zalo-safe-top sticky top-0 z-30 border-b border-gold/15 bg-ink/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Quay lại"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-cream/70 hover:text-gold"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <p className="font-heading text-base font-semibold text-cream leading-tight">{title}</p>
          {step ? (
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold/70">{step}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
