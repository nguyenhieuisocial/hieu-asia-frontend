'use client';

/**
 * ProvinceWardSelect — cascading Tỉnh/Thành → Phường/Xã picker for Vietnam's
 * post-2025 2-tier administrative model (no district level). Province uses a
 * plain Select (34 options); ward uses a searchable Popover combobox because a
 * province can have a few hundred wards. Dataset is lazy-loaded on mount.
 *
 * Controlled: pass `value` + `onChange`. Reusable across web / admin / miniapp.
 */

import * as React from 'react';
import { cn } from '../lib/utils';
import { Input } from './Input';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './Select';
import { loadVnProvinces, type VnProvince, type VnWard } from '../lib/vn-locations';

export interface ProvinceWardValue {
  provinceCode?: string;
  provinceName?: string;
  wardCode?: string;
  wardName?: string;
}

export interface ProvinceWardSelectProps {
  value?: ProvinceWardValue;
  onChange?: (value: ProvinceWardValue) => void;
  disabled?: boolean;
  className?: string;
  provincePlaceholder?: string;
  wardPlaceholder?: string;
}

export function ProvinceWardSelect({
  value,
  onChange,
  disabled,
  className,
  provincePlaceholder = 'Chọn tỉnh/thành',
  wardPlaceholder = 'Chọn phường/xã',
}: ProvinceWardSelectProps) {
  const [provinces, setProvinces] = React.useState<VnProvince[] | null>(null);
  const [wardQuery, setWardQuery] = React.useState('');
  const [wardOpen, setWardOpen] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    void loadVnProvinces().then((p) => {
      if (active) setProvinces(p);
    });
    return () => {
      active = false;
    };
  }, []);

  const selectedProvince = React.useMemo(
    () => provinces?.find((p) => p.code === value?.provinceCode) ?? null,
    [provinces, value?.provinceCode],
  );

  const wards = selectedProvince?.wards ?? [];
  const filteredWards = React.useMemo(() => {
    const q = wardQuery.trim().toLowerCase();
    if (!q) return wards;
    return wards.filter((w) => w.name.toLowerCase().includes(q));
  }, [wards, wardQuery]);

  const loading = provinces === null;

  const handleProvince = (code: string) => {
    const p = provinces?.find((x) => x.code === code);
    onChange?.({
      provinceCode: p?.code,
      provinceName: p?.name,
      wardCode: undefined,
      wardName: undefined,
    });
    setWardQuery('');
  };

  const handleWard = (w: VnWard) => {
    onChange?.({
      provinceCode: selectedProvince?.code,
      provinceName: selectedProvince?.name,
      wardCode: w.code,
      wardName: w.name,
    });
    setWardOpen(false);
    setWardQuery('');
  };

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row', className)}>
      {/* Tỉnh / Thành phố */}
      <Select
        value={value?.provinceCode}
        onValueChange={handleProvince}
        disabled={disabled || loading}
      >
        <SelectTrigger className="sm:w-1/2" aria-label="Tỉnh / Thành phố">
          <SelectValue placeholder={loading ? 'Đang tải…' : provincePlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {provinces?.map((p) => (
            <SelectItem key={p.code} value={p.code}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Phường / Xã — searchable */}
      <Popover open={wardOpen} onOpenChange={setWardOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled || !selectedProvince}
            aria-label="Phường / Xã"
            aria-expanded={wardOpen}
            className={cn(
              'flex h-10 min-h-11 w-full items-center justify-between rounded-md border border-gold/25 bg-card px-3 py-2 text-sm text-foreground touch-manipulation sm:min-h-10 sm:w-1/2',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <span className={cn('truncate', !value?.wardName && 'text-muted-foreground')}>
              {value?.wardName ?? wardPlaceholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <div className="border-b border-gold/15 p-2">
            <Input
              value={wardQuery}
              onChange={(e) => setWardQuery(e.target.value)}
              placeholder="Tìm phường/xã…"
              aria-label="Tìm phường/xã"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1" role="listbox">
            {filteredWards.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy phường/xã
              </p>
            ) : (
              filteredWards.map((w) => (
                <button
                  key={w.code}
                  type="button"
                  role="option"
                  aria-selected={w.code === value?.wardCode}
                  onClick={() => handleWard(w)}
                  className={cn(
                    'flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
                    'hover:bg-gold/10 focus-visible:bg-gold/10 focus-visible:outline-none',
                    w.code === value?.wardCode ? 'bg-gold/10 text-foreground' : 'text-foreground/85',
                  )}
                >
                  {w.name}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
