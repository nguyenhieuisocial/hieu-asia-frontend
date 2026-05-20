'use client';

import * as React from 'react';
import { Camera, Upload, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { validateImage } from '@/lib/upload-image';

export interface PalmUploadProps {
  onSelect: (file: File, previewUrl: string) => void;
  onClear: () => void;
  file: File | null;
  previewUrl: string | null;
}

interface Dims { w: number; h: number }

export function PalmUpload({ onSelect, onClear, file, previewUrl }: PalmUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cameraRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dims, setDims] = React.useState<Dims | null>(null);

  React.useEffect(() => {
    if (!previewUrl) return setDims(null);
    const img = new window.Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = previewUrl;
  }, [previewUrl]);

  function handleFile(f: File) {
    const err = validateImage(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    const url = URL.createObjectURL(f);
    onSelect(f, url);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  if (file && previewUrl) {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-ink-night/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Ảnh lòng bàn tay" className="mx-auto max-h-[480px] w-auto" />
          <div className="absolute right-3 top-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClear();
                setDims(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              aria-label="Xoá ảnh"
            >
              <X className="h-4 w-4" />
              Chụp lại
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-jade/30 bg-jade/10 px-4 py-3 text-sm">
          <span className="flex items-center gap-2 text-jade-50">
            <CheckCircle2 className="h-4 w-4" />
            Ảnh hợp lệ
          </span>
          <span className="font-mono text-xs text-cream/70">
            {(file.size / 1024 / 1024).toFixed(2)}MB
            {dims && ` · ${dims.w}×${dims.h}`}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={[
          'w-full rounded-xl border-2 border-dashed p-8 text-center transition-colors',
          dragOver
            ? 'border-gold bg-gold/10'
            : 'border-gold/30 bg-ink-night/40 hover:border-gold/60 hover:bg-ink-night/60',
        ].join(' ')}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Upload className="h-6 w-6" />
        </div>
        <p className="text-base font-medium text-cream">Kéo thả ảnh vào đây</p>
        <p className="mt-1 text-sm text-cream/60">hoặc nhấn để chọn từ máy</p>
        <p className="mt-3 text-xs text-cream/40">JPG / PNG / WEBP · tối đa 10MB</p>
      </button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => cameraRef.current?.click()}
      >
        <Camera className="h-4 w-4" />
        Chụp ảnh bằng camera
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {error && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
