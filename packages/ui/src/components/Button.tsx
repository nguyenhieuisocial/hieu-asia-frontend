import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ' +
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ' +
    // Wave 60.41 — `disabled:opacity-50` on `default` variant made the
    // primary gold button render as washed-out tan on cream light bg
    // (≈ #DCC99E text-ink at 50% opacity → invisible on cream). Bump
    // global opacity-50 → opacity-70 so disabled state is more visible.
    // Default variant ALSO gets explicit `disabled:bg-muted text-muted-
    // foreground` (per-variant override below) so primary CTA in disabled
    // state shows a clear inactive block, not a faded gold ghost.
    'disabled:pointer-events-none disabled:opacity-70',
  {
    variants: {
      variant: {
        // Wave 60.41 (sub-agent + user report "Ux/ui lỗi màu sắc khi bật
        // light/dark"): primary CTA in disabled state was unreadable on
        // /signin, /onboarding, /tu-vi-hom-nay because email/form not
        // filled yet. Add explicit muted-bg fallback so users see "yes
        // this is a button, no it's not active yet".
        default: 'bg-gold text-ink hover:bg-gold-400 disabled:bg-muted disabled:text-muted-foreground',
        // Wave 60.22 — `text-gold` on `bg-transparent` over cream background
        // failed WCAG AA contrast (per Chrome MCP audit). Switched to
        // `text-foreground` so the button reads in both themes; hover keeps
        // gold tint via bg + border accent.
        outline: 'border border-gold/40 bg-transparent text-foreground hover:bg-gold/10 hover:text-gold',
        ghost: 'hover:bg-gold/10 text-foreground',
        link: 'text-gold underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render the child as the root element (Radix Slot pattern).
   * Use with `<Link>` to avoid nested interactive elements (WCAG SC 4.1.2):
   *   <Button asChild><Link href="/x">Go</Link></Button>
   */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
});
