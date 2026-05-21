'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Input,
  Label,
  StatusBadge,
  type DataTableColumn,
} from '@hieu-asia/ui';
import { getQdrantStats, ingestRagChunks, listRagChunks } from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';
import type { RagChunk } from '@/lib/mock-data';

const DISCIPLINE_LABEL: Record<RagChunk['discipline'], string> = {
  tu_vi: 'Tử Vi',
  palmistry: 'Bàn tay',
  psychology: 'Tâm lý',
  general: 'Khác',
};

const LICENSE_TONE: Record<RagChunk['license_status'], React.ComponentProps<typeof StatusBadge>['status']> = {
  owned_or_licensed: 'success',
  public_domain: 'info',
  fair_use: 'warning',
};

export default function AdminRagPage() {
  const qc = useQueryClient();
  const chunks = useQuery({ queryKey: ['admin', 'rag', 'chunks'], queryFn: listRagChunks });
  const stats = useQuery({ queryKey: ['admin', 'rag', 'qdrant'], queryFn: getQdrantStats });

  const cols: DataTableColumn<RagChunk>[] = [
    { key: 'source_id', header: 'Source ID', cell: (c) => <span className="font-mono text-xs text-cream/75">{c.source_id}</span> },
    { key: 'source_title', header: 'Tiêu đề', cell: (c) => <span className="text-cream">{c.source_title}</span> },
    {
      key: 'discipline',
      header: 'Discipline',
      width: '110px',
      cell: (c) => <StatusBadge status="neutral" label={DISCIPLINE_LABEL[c.discipline]} />,
    },
    {
      key: 'license_status',
      header: 'License',
      width: '130px',
      cell: (c) => <StatusBadge status={LICENSE_TONE[c.license_status]} label={c.license_status.replace(/_/g, ' ')} />,
    },
    { key: 'chunk_count', header: 'Chunks', align: 'right', width: '80px' },
    {
      key: 'ingested_at',
      header: 'Nhập',
      width: '110px',
      cell: (c) => new Date(c.ingested_at).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-cream">RAG documents</h1>
        <p className="mt-1 text-sm text-cream/65">Tài liệu đã ingest + thống kê Qdrant.</p>
      </div>

      <MockBanner source={chunks.data?._source ?? stats.data?._source} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Collection</CardDescription>
            <CardTitle className="font-mono text-base">{stats.data?.collection ?? '—'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Vectors</CardDescription>
            <CardTitle>{stats.data?.vectors_count.toLocaleString('vi-VN') ?? '—'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Status</CardDescription>
            <CardTitle>
              <StatusBadge status="success" label={stats.data?.status ?? '—'} />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <IngestForm onIngested={() => qc.invalidateQueries({ queryKey: ['admin', 'rag'] })} />

      <Card>
        <CardHeader>
          <CardTitle>Tài liệu đã ingest</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={cols}
            rows={chunks.data ?? []}
            rowKey={(c) => c.id}
            emptyState={chunks.isLoading ? 'Đang tải…' : 'Chưa có tài liệu.'}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function IngestForm({ onIngested }: { onIngested: () => void }) {
  const [sourceId, setSourceId] = React.useState('');
  const [sourceTitle, setSourceTitle] = React.useState('');
  const [text, setText] = React.useState('');
  const [discipline, setDiscipline] = React.useState<RagChunk['discipline']>('tu_vi');
  const [license, setLicense] = React.useState<RagChunk['license_status']>('owned_or_licensed');

  const mutation = useMutation({
    mutationFn: ingestRagChunks,
    onSuccess: () => {
      setText('');
      setSourceId('');
      setSourceTitle('');
      onIngested();
    },
  });

  const onFile = async (file: File) => {
    const txt = await file.text();
    setText(txt);
    if (!sourceTitle) setSourceTitle(file.name);
  };

  const chunks = text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !sourceTitle || chunks.length === 0) return;
    mutation.mutate({
      source_id: sourceId,
      source_title: sourceTitle,
      discipline,
      chunks,
      license_status: license,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingest tài liệu mới</CardTitle>
        <CardDescription>Tải file .txt hoặc dán text — hệ thống tự tách đoạn theo blank line.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="src-id">Source ID</Label>
            <Input id="src-id" value={sourceId} onChange={(e) => setSourceId(e.target.value)} placeholder="vd: tu_vi_co_dien_vol3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="src-title">Tiêu đề</Label>
            <Input id="src-title" value={sourceTitle} onChange={(e) => setSourceTitle(e.target.value)} placeholder="Tử Vi Cổ Điển Quyển 3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disc">Discipline</Label>
            <select
              id="disc"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value as RagChunk['discipline'])}
              className="h-10 w-full rounded-md border border-gold/15 bg-ink/40 px-3 text-sm text-cream"
            >
              <option value="tu_vi">Tử Vi</option>
              <option value="palmistry">Palmistry</option>
              <option value="psychology">Psychology</option>
              <option value="general">General</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lic">License</Label>
            <select
              id="lic"
              value={license}
              onChange={(e) => setLicense(e.target.value as RagChunk['license_status'])}
              className="h-10 w-full rounded-md border border-gold/15 bg-ink/40 px-3 text-sm text-cream"
            >
              <option value="owned_or_licensed">Owned / Licensed</option>
              <option value="public_domain">Public domain</option>
              <option value="fair_use">Fair use</option>
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="file">File text (tùy chọn)</Label>
            <input
              id="file"
              type="file"
              accept=".txt,.md"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              className="block w-full text-sm text-cream/80 file:mr-3 file:rounded file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-sm file:text-gold hover:file:bg-gold/25"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="text">Hoặc dán text trực tiếp</Label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Dán nội dung. Mỗi đoạn cách nhau bằng dòng trống."
              className="block w-full rounded-md border border-gold/15 bg-ink/40 p-3 text-sm text-cream"
            />
            <p className="text-xs text-cream/55">
              Phát hiện <span className="text-gold">{chunks.length}</span> chunk(s).
            </p>
          </div>
          {mutation.isError && (
            <p className="sm:col-span-2 rounded border border-red-500/40 bg-red-500/10 p-2 text-sm text-red-300">
              {(mutation.error as Error).message}
            </p>
          )}
          {mutation.isSuccess && (
            <p className="sm:col-span-2 rounded border border-jade/40 bg-jade/10 p-2 text-sm text-jade-50">
              Đã ingest {mutation.data.ingested} chunks vào `{mutation.data.source_id}`.
            </p>
          )}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={mutation.isPending || chunks.length === 0 || !sourceId || !sourceTitle}>
              {mutation.isPending ? 'Đang ingest…' : `Ingest ${chunks.length} chunks`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
