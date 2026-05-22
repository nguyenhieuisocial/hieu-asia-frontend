/**
 * React Query optimistic-mutation helper for admin status flips.
 *
 * Pattern: `onMutate` snapshots the current cache + applies the optimistic
 * update; `onError` rolls back to the snapshot; `onSettled` refetches.
 *
 * Use for boolean/enum status toggles where the new value is fully known
 * client-side (suspend affiliate, mark coupon active, flip feature-flag,
 * update commission status). Do NOT use for mutations whose server response
 * carries new computed fields (refund amounts, generated IDs, etc.).
 *
 * @example
 * const toggle = useOptimisticMutation<FeatureFlag[], { key: string; enabled: boolean }>({
 *   queryKey: ['admin', 'feature-flags'],
 *   mutationFn: toggleFlag,
 *   applyOptimistic: (rows, vars) =>
 *     rows.map((r) => (r.key === vars.key ? { ...r, enabled: vars.enabled } : r)),
 *   onSuccess: () => toast.success('Đã cập nhật'),
 *   onError: (err) => toast.error('Cập nhật thất bại', { description: err.message }),
 * });
 */

import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

export interface OptimisticMutationOptions<TCache, TVars, TData = unknown> {
  /** Query key whose cached data is the source of truth for this resource. */
  queryKey: QueryKey;
  /** The actual API call. Receives the variables. */
  mutationFn: (vars: TVars) => Promise<TData>;
  /**
   * Pure transform: given the cached data + variables, return the optimistic
   * next value. If `cache` is `undefined` (cold cache), return whatever you
   * want stored — usually just `undefined` to skip the optimistic write.
   */
  applyOptimistic: (cache: TCache | undefined, vars: TVars) => TCache | undefined;
  /** Toast / side-effect on confirmed success (after server response). */
  onSuccess?: (data: TData, vars: TVars) => void;
  /** Toast / side-effect on rollback (after server error). */
  onError?: (err: Error, vars: TVars) => void;
  /**
   * Whether to refetch (`invalidateQueries`) after the mutation settles.
   * Default `true`. Set `false` if the server response already gives you
   * the canonical row and you wrote it via `onSuccess`.
   */
  refetchOnSettled?: boolean;
}

interface MutationContext<TCache> {
  previous: TCache | undefined;
}

/**
 * Wraps `useMutation` with optimistic-update + rollback semantics.
 *
 * Returns a standard `UseMutationResult` so callers use it like any other
 * React Query mutation (`mut.mutate(vars)`, `mut.isPending`, …).
 */
export function useOptimisticMutation<TCache, TVars, TData = unknown>(
  options: OptimisticMutationOptions<TCache, TVars, TData>,
): UseMutationResult<TData, Error, TVars, MutationContext<TCache>> {
  const qc = useQueryClient();
  const {
    queryKey,
    mutationFn,
    applyOptimistic,
    onSuccess,
    onError,
    refetchOnSettled = true,
  } = options;

  const mutationOptions: UseMutationOptions<TData, Error, TVars, MutationContext<TCache>> = {
    mutationFn,
    onMutate: async (vars) => {
      // Cancel any in-flight refetch so it doesn't clobber our optimistic write.
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<TCache>(queryKey);
      const next = applyOptimistic(previous, vars);
      if (next !== undefined) {
        qc.setQueryData<TCache>(queryKey, next);
      }
      return { previous };
    },
    onError: (err, vars, ctx) => {
      // Rollback to the snapshot we took in onMutate.
      if (ctx?.previous !== undefined) {
        qc.setQueryData<TCache>(queryKey, ctx.previous);
      }
      onError?.(err, vars);
    },
    onSuccess: (data, vars) => {
      onSuccess?.(data, vars);
    },
    onSettled: () => {
      if (refetchOnSettled) {
        qc.invalidateQueries({ queryKey });
      }
    },
  };

  return useMutation(mutationOptions);
}
