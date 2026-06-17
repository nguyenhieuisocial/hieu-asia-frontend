import { describe, expect, it } from 'vitest';
import { deriveFailureReason, groupFailureReasons } from './task-failure-reason';

describe('deriveFailureReason', () => {
  it('extracts the service from error_at_<service>', () => {
    expect(deriveFailureReason('error_at_vision_agent')).toBe('vision_agent');
    expect(deriveFailureReason('error_at_qdrant')).toBe('qdrant');
  });

  it('maps error_internal → internal', () => {
    expect(deriveFailureReason('error_internal')).toBe('internal');
  });

  it('returns the suffix for any error_at_ prefix', () => {
    expect(deriveFailureReason('error_at_llm_router')).toBe('llm_router');
  });

  it('maps a non-prefixed error-ish status → other', () => {
    expect(deriveFailureReason('errored')).toBe('other');
  });

  it('returns "" for non-error statuses', () => {
    expect(deriveFailureReason('done')).toBe('');
    expect(deriveFailureReason('running')).toBe('');
    expect(deriveFailureReason('pending')).toBe('');
  });
});

describe('groupFailureReasons', () => {
  it('counts per reason, sorts desc by count, filters non-errors', () => {
    const rows = [
      { status: 'error_at_qdrant' },
      { status: 'error_at_qdrant' },
      { status: 'error_at_vision_agent' },
      { status: 'error_internal' },
      { status: 'done' }, // filtered out (non-error)
      { status: 'running' }, // filtered out (non-error)
      { status: 'error_at_qdrant' },
    ];
    expect(groupFailureReasons(rows)).toEqual([
      { reason: 'qdrant', count: 3 },
      { reason: 'vision_agent', count: 1 },
      { reason: 'internal', count: 1 },
    ]);
  });

  it('returns [] when there are no failed rows', () => {
    expect(groupFailureReasons([{ status: 'done' }, { status: 'running' }])).toEqual([]);
  });

  it('handles an empty input', () => {
    expect(groupFailureReasons([])).toEqual([]);
  });
});
