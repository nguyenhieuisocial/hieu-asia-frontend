'use client';

import { useQuery } from '@tanstack/react-query';
import { getQueueDepth } from '@/lib/admin-api';

export function useQueueDepth() {
  return useQuery({
    queryKey: ['admin', 'queue-depth'],
    queryFn: getQueueDepth,
    refetchInterval: 30_000,
  });
}
