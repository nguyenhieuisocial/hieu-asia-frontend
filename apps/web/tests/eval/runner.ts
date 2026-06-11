// hieu.asia — Eval runner (Wave 60.94.n)
//
// Usage:
//   pnpm --filter web test:eval
//   pnpm --filter web test:eval -- --persona anh_khoa --max-samples 5
//   pnpm --filter web test:eval -- --judge-mode rubric-only  (skip expensive LLM judge)
//
// Output:
//   - JSONL log: tests/eval/results/<ISO-date>.jsonl
//   - Markdown summary: tests/eval/results/<ISO-date>.md
//   - Sentry alert if avg score < 8.5 (weekly GHA cron only)

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { scoreByRubric, type EvalSample, type ReadingOutput } from './rubric';
import { judgeWithLLM, type JudgeVerdict } from './llm-judge';

interface RunnerOptions {
  personaFilter?: string;
  maxSamples?: number;
  judgeMode: 'rubric-only' | 'rubric-plus-llm' | 'llm-only';
  apiBaseUrl: string;
  adminToken: string;
  outputDir: string;
}

interface EvalResult {
  sample: EvalSample;
  output: ReadingOutput;
  rubric_score: number;
  rubric_breakdown: ReturnType<typeof scoreByRubric>;
  llm_verdict: JudgeVerdict | null;
  final_score: number; // weighted: rubric * 0.4 + llm * 0.6 when llm present
  duration_ms: number;
  error: string | null;
}

function loadPersonaSamples(personaDir: string, filter?: string): EvalSample[] {
  const files = readdirSync(personaDir).filter((f) => f.endsWith('.jsonl'));
  const samples: EvalSample[] = [];
  for (const f of files) {
    if (filter && !f.toLowerCase().includes(filter.toLowerCase())) continue;
    const content = readFileSync(join(personaDir, f), 'utf-8');
    for (const line of content.split('\n').filter((l) => l.trim())) {
      try {
        samples.push(JSON.parse(line));
      } catch (e) {
        console.error(`Parse error in ${f}: ${(e as Error).message}`);
      }
    }
  }
  return samples;
}

async function generateReading(sample: EvalSample, opts: RunnerOptions): Promise<ReadingOutput> {
  const response = await fetch(`${opts.apiBaseUrl}/reading/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': opts.adminToken,
      'X-Eval-Sample-Id': sample.id, // tags Sentry events for traceability
    },
    body: JSON.stringify({
      birth: sample.input,
      mode: 'eval', // signals orchestrate to skip caching + use deterministic temp=0
    }),
  });

  if (!response.ok) {
    throw new Error(`generateReading failed: ${response.status} ${await response.text()}`);
  }

  const sessionData = (await response.json()) as { session_id: string };

  // Poll until ready (eval runs are sync; up to 60s)
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const get = await fetch(`${opts.apiBaseUrl}/reading/${sessionData.session_id}`, {
      headers: { 'X-Admin-Token': opts.adminToken },
    });
    if (get.ok) {
      const data = (await get.json()) as { status: string; output?: ReadingOutput };
      if (data.status === 'completed' && data.output) return data.output;
    }
  }
  throw new Error(`Reading session ${sessionData.session_id} did not complete within 60s`);
}

async function runOne(sample: EvalSample, opts: RunnerOptions): Promise<EvalResult> {
  const start = Date.now();
  try {
    const output = await generateReading(sample, opts);
    const rubric = scoreByRubric(sample, output);

    let llmVerdict: JudgeVerdict | null = null;
    // LLM-as-judge: only call for low-rubric-score samples (cost optimization)
    // OR if explicitly requested via --judge-mode llm-only
    if (opts.judgeMode === 'llm-only' || (opts.judgeMode === 'rubric-plus-llm' && rubric.raw_score < 9.0)) {
      llmVerdict = await judgeWithLLM(sample, output, opts.adminToken, opts.apiBaseUrl);
    }

    const final_score = llmVerdict
      ? rubric.raw_score * 0.4 + llmVerdict.score * 0.6
      : rubric.raw_score;

    return {
      sample,
      output,
      rubric_score: rubric.raw_score,
      rubric_breakdown: rubric,
      llm_verdict: llmVerdict,
      final_score: Math.round(final_score * 10) / 10,
      duration_ms: Date.now() - start,
      error: null,
    };
  } catch (e) {
    return {
      sample,
      output: {} as ReadingOutput,
      rubric_score: 0,
      rubric_breakdown: {} as ReturnType<typeof scoreByRubric>,
      llm_verdict: null,
      final_score: 0,
      duration_ms: Date.now() - start,
      error: (e as Error).message,
    };
  }
}

function writeMarkdownSummary(results: EvalResult[], outputPath: string): void {
  const avgScore = results.filter((r) => !r.error).reduce((sum, r) => sum + r.final_score, 0) / results.filter((r) => !r.error).length;
  const passRate = (results.filter((r) => !r.error && r.final_score >= 9.0).length / results.length) * 100;
  const errors = results.filter((r) => r.error).length;

  const md = `# Eval run ${new Date().toISOString()}

## Summary

- Samples: ${results.length}
- Errors: ${errors}
- Avg final score: ${avgScore.toFixed(2)} / 10
- Pass rate (≥9.0): ${passRate.toFixed(1)}%
- P4.5 gate: ${avgScore >= 9.0 ? '✅ PASS' : '❌ FAIL'} (target: avg ≥ 9.0)

## Per-sample results

| ID | Persona | Rubric | LLM | Final | Duration |
|---|---|---|---|---|---|
${results.map((r) => `| ${r.sample.id} | ${r.sample.persona} | ${r.rubric_score} | ${r.llm_verdict?.score ?? '—'} | **${r.final_score}** | ${r.duration_ms}ms |`).join('\n')}

## Failures

${results.filter((r) => r.error).map((r) => `- ${r.sample.id}: ${r.error}`).join('\n') || 'None'}
`;
  writeFileSync(outputPath, md, 'utf-8');
}

async function main() {
  const args = process.argv.slice(2);
  const opts: RunnerOptions = {
    personaFilter: args.includes('--persona') ? args[args.indexOf('--persona') + 1] : undefined,
    maxSamples: args.includes('--max-samples') ? parseInt(args[args.indexOf('--max-samples') + 1], 10) : undefined,
    judgeMode: (args.includes('--judge-mode') ? args[args.indexOf('--judge-mode') + 1] : 'rubric-plus-llm') as RunnerOptions['judgeMode'],
    apiBaseUrl: process.env.EVAL_API_URL || 'https://api.hieu.asia',
    adminToken: process.env.ADMIN_TOKEN || '',
    outputDir: join(import.meta.dirname || '.', 'results'),
  };

  if (!opts.adminToken) {
    console.error('ERROR: ADMIN_TOKEN env var required');
    process.exit(1);
  }

  mkdirSync(opts.outputDir, { recursive: true });

  const personaDir = join(import.meta.dirname || '.', 'persona');
  const allSamples = loadPersonaSamples(personaDir, opts.personaFilter);
  const samples = opts.maxSamples ? allSamples.slice(0, opts.maxSamples) : allSamples;

  console.log(`Running eval: ${samples.length} samples, judge mode=${opts.judgeMode}`);

  const results: EvalResult[] = [];
  for (const sample of samples) {
    const r = await runOne(sample, opts);
    results.push(r);
    console.log(`[${r.sample.id}] ${r.error ? `❌ ${r.error}` : `✅ ${r.final_score}/10 (${r.duration_ms}ms)`}`);
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonlPath = join(opts.outputDir, `${ts}.jsonl`);
  const mdPath = join(opts.outputDir, `${ts}.md`);

  writeFileSync(jsonlPath, results.map((r) => JSON.stringify(r)).join('\n'), 'utf-8');
  writeMarkdownSummary(results, mdPath);

  const avgScore = results.filter((r) => !r.error).reduce((sum, r) => sum + r.final_score, 0) / results.filter((r) => !r.error).length;
  console.log(`\nAvg: ${avgScore.toFixed(2)}/10 | Reports: ${mdPath}`);

  // Exit code 1 if avg < P4.5 gate → GHA workflow fails → Sentry alert via webhook
  process.exit(avgScore >= 9.0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
