import * as React from 'react';
import { cn } from '../lib/utils';

/** Minimal Card primitives. Replace with `pnpm dlx shadcn add card` post-install. */

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Card({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-gold/15 bg-card/80 text-card-foreground shadow-sm backdrop-blur-sm',
          className,
        )}
        {...props}
      />
    );
  },
);

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
  },
);

/** Cấp thẻ tiêu đề cho CardTitle. Mặc định `h3` (giữ nguyên hành vi cũ), nhưng
 * trang nào có Card là MỤC ĐẦU TIÊN ngay dưới `h1` thì phải hạ về `h2` — nhảy
 * h1 → h3 là lỗi trợ năng `heading-order` (WCAG 1.3.1). Sửa ở đây một nguồn để
 * mọi trang chọn được đúng cấp thay vì chép tay `<h2>` với class của CardTitle. */
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h2' | 'h3' | 'h4';
};

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className, as: Tag = 'h3', ...props }, ref) {
    return (
      <Tag
        ref={ref}
        className={cn('font-heading text-xl font-semibold leading-none tracking-tight text-foreground', className)}
        {...props}
      />
    );
  },
);

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />;
});

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
  },
);

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />;
  },
);
