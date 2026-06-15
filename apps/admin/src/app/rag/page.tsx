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
import { ingestRagChunks, listRagChunks } from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { BookOpen, FileText, Database, Layers, RotateCw } from 'lucide-react';
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
  const chunks = useQuery({ queryKey: ['admin', 'rag', 'chunks'], queryFn: listRagChunks, staleTime: 60_000 });

  const cols: DataTableColumn<RagChunk>[] = [
    { key: 'source_id', header: 'Source ID', cell: (c) => <span className="font-mono text-xs text-foreground/85">{c.source_id}</span> },
    { key: 'source_title', header: 'Tiêu đề', cell: (c) => <span className="text-foreground">{c.source_title}</span> },
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
    {
      key: 'actions',
      header: '',
      width: '110px',
      // Worker /admin/rag/reindex returns 501 (pipeline chưa triển khai) — disable
      // the button and label it "sắp có" so we don't promise an action that no-ops.
      cell: () => (
        <Button
          size="sm"
          variant="outline"
          disabled
          title="Pipeline reindex chưa triển khai ở backend"
          aria-label="Reindex chưa khả dụng"
        >
          <RotateCw className="mr-1 h-3 w-3" />
          Reindex (sắp có)
        </Button>
      ),
    },
  ];

  const rows = chunks.data ?? [];
  const docCount = rows.length;
  const chunkCount = rows.reduce((s, r) => s + (r.chunk_count ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="RAG documents"
        description="Tài liệu đã ingest cho retrieval. Embeddings lưu trong pgvector."
        icon={<BookOpen className="h-5 w-5" />}
      />

      {/* Banner reflects ONLY the chunks list (the data with a real source).
          getQdrantStats is permanently mock (/admin/qdrant/stats không tồn tại),
          so feeding it into the banner would flip the whole page to "mock" even
          when corpus_chunks is real. The Qdrant/Collection KPIs are labelled
          "chưa có endpoint" instead. */}
      <MockBanner source={chunks.data?._source} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Documents"
          value={docCount.toLocaleString('vi-VN')}
          icon={<FileText className="h-4 w-4" />}
          accent="gold"
          hint="đã ingest"
        />
        <KpiCard
          label="Chunks"
          value={chunkCount.toLocaleString('vi-VN')}
          icon={<Layers className="h-4 w-4" />}
          accent="purple"
          hint="vector rows"
        />
        <KpiCard
          label="Collection"
          value={<span className="font-mono text-base">pgvector</span>}
          icon={<Database className="h-4 w-4" />}
          accent="jade"
          hint="chưa có endpoint"
        />
        <KpiCard
          label="Status"
          value={<StatusBadge status="info" label="chưa có endpoint" />}
          icon={<BookOpen className="h-4 w-4" />}
          accent="jade"
        />
      </div>

      <IngestForm onIngested={() => qc.invalidateQueries({ queryKey: ['admin', 'rag'] })} />

      <Card>
        <CardHeader>
          <CardTitle>Tài liệu đã ingest</CardTitle>
          <CardDescription>Group theo document_id; chunks tính ngược từ corpus_chunks.</CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 && !chunks.isLoading ? (
            <EmptyState
              title="Chưa có tài liệu nào"
              description="Dùng form trên để ingest tài liệu đầu tiên. Mỗi blank-line trong text tạo 1 chunk; embeddings được sinh tự động."
              className="border-0 bg-transparent"
            />
          ) : (
            <DataTable
              columns={cols}
              rows={rows}
              rowKey={(c) => c.id}
              emptyState={chunks.isLoading ? 'Đang tải…' : 'Chưa có tài liệu.'}
            />
          )}
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
    onSuccess: (data) => {
      // ingestRagChunks is a hardcoded mock (POST /admin/rag/ingest không tồn tại
      // ở worker). It never stores anything → do NOT clear the form or show a
      // success banner that would lie about data being saved. The isMock flag
      // drives the "chưa kết nối backend" notice below instead.
      if (data.isMock) return;
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
    // Backend endpoint (POST /admin/rag/ingest) chưa tồn tại → không gọi mock.
    // Guard chặn cả Enter-submit để form không giả vờ đã lưu. Bỏ return này khi
    // backend wire xong (cùng lúc bỏ `disabled` ở nút Ingest).
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingest tài liệu mới</CardTitle>
        <CardDescription>Tải file .txt hoặc dán text — hệ thống tự tách đoạn theo blank line.</CardDescription>
        <p className="mt-2 rounded border border-warn-500/40 bg-warn-500/10 p-2 text-xs text-warn-700 dark:text-warn-300">
          Chưa kết nối backend — endpoint ingest (POST /admin/rag/ingest) chưa có ở worker. Form chỉ
          để xem trước; bấm Ingest sẽ KHÔNG lưu gì.
        </p>
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
              className="h-10 w-full rounded-md border border-gold/15 bg-card/60 px-3 text-sm text-foreground"
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
              className="h-10 w-full rounded-md border border-gold/15 bg-card/60 px-3 text-sm text-foreground"
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
              className="block w-full text-sm text-foreground/85 file:mr-3 file:rounded file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-sm file:text-gold hover:file:bg-gold/25"
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
              className="block w-full rounded-md border border-gold/15 bg-card/60 p-3 text-sm text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Phát hiện <span className="text-gold">{chunks.length}</span> chunk(s).
            </p>
          </div>
          {mutation.isError && (
            <div className="sm:col-span-2">
              <ErrorBlock
                compact
                message={(mutation.error as Error).message}
              />
            </div>
          )}
          {/* Mock path: never claim success. ingestRagChunks returns isMock=true
              because the worker endpoint doesn't exist. Surface that honestly. */}
          {mutation.isSuccess && mutation.data.isMock && (
            <p className="sm:col-span-2 rounded border border-warn-500/40 bg-warn-500/10 p-2 text-sm text-warn-700 dark:text-warn-300">
              Chưa kết nối backend (mock) — {chunks.length} chunk(s) KHÔNG được lưu. Cần wire
              POST /admin/rag/ingest ở worker trước.
            </p>
          )}
          <div className="sm:col-span-2">
            {/* Endpoint POST /admin/rag/ingest chưa có ở worker → submit luôn
                disabled để KHÔNG đánh lừa founder rằng ingest hoạt động. Bỏ
                disable khi backend wire xong (đổi `true` → điều kiện field). */}
            <Button
              type="submit"
              disabled
              title="Endpoint ingest (POST /admin/rag/ingest) chưa có ở backend"
              aria-label="Ingest chưa khả dụng — backend chưa kết nối"
            >
              Ingest {chunks.length} chunks (sắp ra mắt — chưa kết nối backend)
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
