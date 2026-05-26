import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GlassPanel } from './GlassPanel';

/**
 * Wave 60.66.Polish — GlassPanel snapshots for Option E "Editorial Live"
 * glassmorphism overlay layer.
 *
 * Guards the backdrop-blur + border-tint matrix against drift. The reduced-
 * transparency fallback is exercised by the global `.glass-panel` rule in
 * `globals.css`; the dedicated story below documents the spec but cannot
 * force the media query — Chromatic captures both states via OS prefs.
 */
const meta: Meta<typeof GlassPanel> = {
  title: 'Marketing/GlassPanel',
  component: GlassPanel,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof GlassPanel>;

/** Default: dark tint (warm-dark-100/55) + gold/20 border for CTA emphasis. */
export const Default: Story = {
  render: (args) => (
    <div className="bg-warm-dark-50 p-12">
      <GlassPanel {...args}>
        <div className="px-6 py-5">
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
            — BẢO ĐẢM
          </p>
          <p className="mt-2 font-sans text-base text-cream-50">
            5 phút · miễn phí · không cần thẻ
          </p>
        </div>
      </GlassPanel>
    </div>
  ),
  args: {
    tint: 'dark',
    border: 'gold',
  },
};

/** Light tint (white/55) — for use over rich tone PaintedCanvas surfaces. */
export const LightTint: Story = {
  render: Default.render,
  args: {
    tint: 'light',
    border: 'gold',
  },
};

/** No border — for inline trust strips embedded inside larger sections. */
export const NoBorder: Story = {
  render: Default.render,
  args: {
    tint: 'dark',
    border: 'none',
  },
};

/**
 * Reduced-transparency fallback — documents the WCAG accessibility commitment.
 * Real fallback engages when OS-level `prefers-reduced-transparency: reduce`
 * is set; the `.glass-panel` rule in `globals.css` swaps to opaque warm-dark.
 * Chromatic captures the OS-default state; this story exists for parity audit.
 */
export const ReducedTransparencyFallback: Story = {
  render: (args) => (
    <div className="bg-warm-dark-50 p-12">
      <style>{`
        .glass-panel-fallback-demo {
          background-color: rgb(27 23 20) !important;
          backdrop-filter: none !important;
        }
      `}</style>
      <GlassPanel {...args} className="glass-panel-fallback-demo">
        <div className="px-6 py-5">
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
            — FALLBACK
          </p>
          <p className="mt-2 font-sans text-base text-cream-50">
            Opaque warm-dark cho prefers-reduced-transparency
          </p>
        </div>
      </GlassPanel>
    </div>
  ),
  args: {
    tint: 'dark',
    border: 'gold',
  },
};
