'use client';

/**
 * Form 2-person birth-year input cho Hợp Tuổi.
 *
 * Mỗi person gồm: tên (optional), năm sinh dương lịch, giới tính (cho cung phi).
 * Compact, mobile-first — stack vertical < md, side-by-side >= md.
 */

import * as React from 'react';
import { Input, Label, RadioGroup, RadioGroupItem, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';

export interface PersonInput {
  name: string;
  year: string;
  gender: 'M' | 'F';
}

interface Props {
  value: [PersonInput, PersonInput];
  onChange: (value: [PersonInput, PersonInput]) => void;
  labels?: [string, string];
}

const CURRENT_YEAR = new Date().getFullYear();

function PersonCard({
  label,
  value,
  onChange,
  idPrefix,
}: {
  label: string;
  value: PersonInput;
  onChange: (v: PersonInput) => void;
  idPrefix: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gold">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-name`}>Tên gọi (tuỳ chọn)</Label>
          <Input
            id={`${idPrefix}-name`}
            placeholder="VD: Anh Nam"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-year`}>Năm sinh (dương lịch)</Label>
          <Input
            id={`${idPrefix}-year`}
            type="number"
            inputMode="numeric"
            min={1900}
            max={CURRENT_YEAR}
            placeholder="VD: 1990"
            value={value.year}
            onChange={(e) => onChange({ ...value, year: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Giới tính</Label>
          <RadioGroup
            name={`${idPrefix}-gender`}
            value={value.gender}
            onValueChange={(g) => onChange({ ...value, gender: g as 'M' | 'F' })}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="M" id={`${idPrefix}-m`} />
              <Label htmlFor={`${idPrefix}-m`}>Nam</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="F" id={`${idPrefix}-f`} />
              <Label htmlFor={`${idPrefix}-f`}>Nữ</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export function BirthInputPair({ value, onChange, labels }: Props) {
  const [l1, l2] = labels ?? ['Người 1', 'Người 2'];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <PersonCard
        idPrefix="p1"
        label={l1}
        value={value[0]}
        onChange={(v) => onChange([v, value[1]])}
      />
      <PersonCard
        idPrefix="p2"
        label={l2}
        value={value[1]}
        onChange={(v) => onChange([value[0], v])}
      />
    </div>
  );
}

export function isValidPerson(p: PersonInput): boolean {
  const y = parseInt(p.year, 10);
  return Number.isInteger(y) && y >= 1900 && y <= CURRENT_YEAR && (p.gender === 'M' || p.gender === 'F');
}
