'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles as SparklesIcon } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { AnimatedBeam } from '@/components/animations/AnimatedBeam';
import { Sparkles } from '@/components/animations/Sparkles';
import { TextRotate } from '@/components/animations/TextRotate';

const ROTATING_WORDS = ['Tử Vi', 'MBTI', 'Palm Reading', 'AI Mentor'];

export function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-background">
      {/* Layered backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_at_top,_rgba(59,39,84,0.35)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(184,146,61,0.18)_0%,_transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-[0.07] [background-image:linear-gradient(rgba(184,146,61,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(184,146,61,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <AnimatedBeam className="-z-10 hidden md:block" />
      <Sparkles count={28} className="-z-10 hidden md:block" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-card/60 px-4 py-1.5 backdrop-blur-sm"
        >
          <SparklesIcon className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/90 sm:text-xs">
            Premium AI insight platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-4xl font-heading text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Hiểu chính mình.
          <br />
          <span className="bg-gold-gradient bg-clip-text text-transparent">Quyết định tốt hơn.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-heading text-2xl font-medium text-foreground/90 sm:text-3xl"
        >
          <TextRotate words={ROTATING_WORDS} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Người bạn đồng hành huyền học hiện đại — phân tích sâu, đồng cảm,
          không định mệnh hóa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
        >
          {/* Wave 60.79.T2 (vault 112 P1): primary CTA min-h-12 (48px), secondary min-h-11 (44px). */}
          <Button asChild size="lg" className="group min-h-12 w-full min-w-[200px] sm:w-auto"><Link href="/onboarding" className="w-full sm:w-auto">

              Bắt đầu phân tích
              <ArrowRight
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />

          </Link></Button>
          <Button asChild size="lg" variant="outline" className="min-h-11 w-full min-w-[200px] sm:w-auto"><Link href="#how" className="w-full sm:w-auto">
            
              Xem cách hoạt động
            
          </Link></Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-y-3 divide-border sm:grid-cols-3 sm:divide-x"
        >
          <Stat value="10,000+" label="phân tích đã tạo" />
          <Stat value="95%" label="người dùng quay lại" />
          <Stat value="30s" label="để bắt đầu báo cáo" />
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-4 sm:px-2">
      <span className="font-mono text-xl font-semibold text-gold sm:text-2xl">{value}</span>
      <span className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</span>
    </div>
  );
}
