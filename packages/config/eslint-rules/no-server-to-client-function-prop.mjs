/**
 * Wave 60.70 — RSC discipline ESLint rule.
 *
 * Catches the 2 most common Server→Client serialization regressions we've
 * hit in production:
 *
 * 1. Inline arrow fns NESTED inside JSX prop data structures
 *    (Wave 60.66.HF1, commit 82ab9bc):
 *      `<BigNumberRow numbers={[{ format: (n) => n.toFixed(1), ... }]} />`
 *    → 1100 Sentry events / 5h. Fix: use serializable primitive
 *      (`decimalPlaces: number`).
 *
 * 2. Lucide icon Component refs NESTED inside JSX prop data structures
 *    (Wave 60.65.P0a, commit 4954a71):
 *      `<BentoLens lenses={[{ icon: Sparkles, ... }]} />`
 *    → 1033 Sentry events / 7d. Fix: pre-render JSX at call site:
 *      `icon: <Sparkles className="..." />`.
 *
 * Architectural lesson (vault 109 §3 + vault 94):
 * Server Components cannot pass non-serializable values (Functions,
 * Component refs, Class instances, Symbols) to Client Components via props.
 * The RSC payload is JSON-serialized — functions and forwardRef objects
 * cannot survive the boundary.
 *
 * HEURISTIC (intentionally narrow to minimize false positives):
 *
 *   ONLY flags non-serializable values NESTED inside an ObjectExpression
 *   or ArrayExpression that itself is the prop value. Both production
 *   regressions had this exact shape: `prop={[{ icon: X, format: fn }]}`
 *   or `prop={{ icon: X }}`. Direct `prop={fn}` and `prop={Icon}` are NOT
 *   flagged because:
 *
 *   - Direct event handlers (`onClick={fn}`) are universal — flagging them
 *     would force every component to be Client (huge false positive rate).
 *   - Direct `Icon={LucideIcon}` is a common local-component pattern
 *     (`<TrustBadge Icon={Users}>`) where the parent renders `<Icon ...>`
 *     server-side without ever serializing the ref.
 *
 *   The dangerous case — and the one both production bugs hit — is when
 *   the value is BURIED in a config-shaped data structure. That structure
 *   typically flows from a Server Component to a Client Component, and
 *   the buried ref/fn dies at the RSC boundary.
 *
 *   Additionally, only files WITHOUT a `'use client'` directive are linted.
 *   Stories / tests are exempt (rendered client-side via Storybook / Jest).
 *
 * Does NOT catch:
 *   - Lucide icons aliased to other names (`import { Sparkles as Foo }`)
 *   - Custom Component refs (only Lucide stdlib names from known set)
 *   - Class instances / Symbols
 *   - Direct prop assignment (intentional — too many false positives)
 *
 * For production-grade RSC boundary checking, consider Next.js's built-in
 * lint rules (when available) or a type-graph analyzer that knows which
 * imported components are `'use client'`.
 *
 * Refs:
 *   - vault://94 Wave 60.66.HF1 BigNumberRow function leak
 *   - vault://109 §3 RSC serialization rules
 *   - commit 4954a71 — Wave 60.65.P0a Lucide forwardRef fix
 *   - commit 82ab9bc — Wave 60.66.HF1 BigNumberRow fix
 */

// Known Lucide icon component names (extracted from apps/web/src usage 2026-05-26).
// Stale entries are fine — false positives only fire on bare Identifier nested
// in an ObjectExpression/ArrayExpression prop value matching one of these names.
const LUCIDE_ICONS = new Set([
  'Activity',
  'AlertCircle',
  'AlertTriangle',
  'Apple',
  'ArrowLeft',
  'ArrowRight',
  'BookOpen',
  'Brain',
  'Briefcase',
  'Calendar',
  'CalendarCheck',
  'Camera',
  'Check',
  'CheckCircle2',
  'ChevronDown',
  'ChevronLeft',
  'ChevronRight',
  'ChevronUp',
  'ClipboardEdit',
  'ClipboardList',
  'Compass',
  'Copy',
  'Cpu',
  'CreditCard',
  'Crosshair',
  'Download',
  'Edit3',
  'Eye',
  'Facebook',
  'FileSearch',
  'FileText',
  'Focus',
  'GitCommit',
  'Globe2',
  'Hand',
  'Hash',
  'Heart',
  'Home',
  'Info',
  'Layers',
  'LayoutDashboard',
  'Lightbulb',
  'ListChecks',
  'Loader2',
  'LockKeyhole',
  'LogOut',
  'Mail',
  'Map',
  'Meh',
  'Menu',
  'MessageCircle',
  'MessageSquare',
  'MessageSquareHeart',
  'Moon',
  'MoreVertical',
  'Mountain',
  'MoveDiagonal',
  'Network',
  'PiggyBank',
  'Plus',
  'Printer',
  'Quote',
  'Scale',
  'ScanLine',
  'ScrollText',
  'Share2',
  'Shield',
  'ShieldAlert',
  'ShieldCheck',
  'Sparkles',
  'Star',
  'Sun',
  'Target',
  'ThumbsDown',
  'ThumbsUp',
  'Timer',
  'Trash2',
  'TrendingUp',
  'Trophy',
  'Upload',
  'User',
  'UserCircle2',
  'Users',
  'Wallet',
  'X',
]);

/**
 * Inspect the source file's directive prologue for `'use client'`. If
 * present, the file is a Client Component — Client→Client prop passing
 * doesn't cross the RSC boundary, so the rule no-ops.
 */
function isClientFile(sourceCode) {
  const body = sourceCode && sourceCode.ast && sourceCode.ast.body;
  if (!Array.isArray(body)) return false;
  for (const stmt of body) {
    if (stmt.type !== 'ExpressionStatement') break;
    if (stmt.directive === 'use client') return true;
    if (stmt.directive == null) break;
  }
  return false;
}

/** Storybook stories + Jest tests render client-side. */
function isStoryOrTestFile(filename) {
  if (!filename) return false;
  return (
    /\.stories\.(t|j)sx?$/.test(filename) ||
    /\.test\.(t|j)sx?$/.test(filename) ||
    /\.spec\.(t|j)sx?$/.test(filename) ||
    /\/__tests__\//.test(filename) ||
    /\/__mocks__\//.test(filename)
  );
}

function reportNode(context, node, messageId, data) {
  context.report({ node, messageId, data });
}

/**
 * Check a single nested value for bad patterns. Called only on values
 * nested INSIDE an Object/Array (not direct JSX prop values).
 */
function checkNestedValue(context, expr, propName) {
  if (!expr) return;

  if (expr.type === 'ArrowFunctionExpression') {
    reportNode(context, expr, 'arrowFn', { name: propName });
    return;
  }

  if (expr.type === 'FunctionExpression') {
    reportNode(context, expr, 'functionExpr', { name: propName });
    return;
  }

  if (expr.type === 'Identifier' && LUCIDE_ICONS.has(expr.name)) {
    reportNode(context, expr, 'lucideRef', { name: expr.name });
    return;
  }
}

/** Walk an ObjectExpression and check each property's value (nested). */
function checkObjectExpression(context, obj) {
  if (!obj || obj.type !== 'ObjectExpression') return;
  for (const prop of obj.properties) {
    if (prop.type !== 'Property') continue;
    const key = prop.key;
    const propName =
      key && (key.name || key.value)
        ? String(key.name || key.value)
        : '(unknown)';
    checkNestedValue(context, prop.value, propName);
    if (prop.value && prop.value.type === 'ObjectExpression') {
      checkObjectExpression(context, prop.value);
    }
    if (prop.value && prop.value.type === 'ArrayExpression') {
      checkArrayExpression(context, prop.value);
    }
  }
}

/** Walk an ArrayExpression — recurse into Object/Array element items. */
function checkArrayExpression(context, arr) {
  if (!arr || arr.type !== 'ArrayExpression') return;
  for (const elem of arr.elements) {
    if (!elem) continue;
    if (elem.type === 'ObjectExpression') {
      checkObjectExpression(context, elem);
    } else if (elem.type === 'ArrayExpression') {
      checkArrayExpression(context, elem);
    } else {
      checkNestedValue(context, elem, '(array item)');
    }
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow non-serializable values (functions, Lucide Component refs) nested inside JSX prop data structures in Server Component files. RSC Server→Client boundary cannot serialize these.',
      url: 'https://github.com/anthropics/claude-code/issues/rsc-discipline',
    },
    schema: [],
    messages: {
      arrowFn:
        'Inline arrow function nested in prop data structure (`{{name}}`) cannot serialize across Server→Client RSC boundary. Use a serializable primitive (e.g. `decimalPlaces: number`) or add `"use client"` to this file. See Wave 60.66.HF1 (BigNumberRow).',
      functionExpr:
        'Function expression nested in prop data structure (`{{name}}`) cannot serialize across Server→Client RSC boundary. Use a serializable primitive or add `"use client"` to this file.',
      lucideRef:
        'Lucide icon `{{name}}` Component ref nested in prop data structure cannot serialize across Server→Client RSC boundary. Pre-render JSX: `{{name}}: <{{name}} className="..." />` instead of bare `{{name}}`. See Wave 60.65.P0a (BentoLens).',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode ? context.getSourceCode() : context.sourceCode;
    if (isClientFile(sourceCode)) return {};

    const filename = context.getFilename ? context.getFilename() : context.filename;
    if (isStoryOrTestFile(filename)) return {};

    return {
      JSXAttribute(node) {
        if (!node.value) return;
        if (node.value.type !== 'JSXExpressionContainer') return;

        const expr = node.value.expression;
        if (!expr) return;

        // Only check NESTED structures — the actual regression pattern.
        // Direct `prop={fn}` and `prop={Icon}` are intentionally not flagged
        // (too many false positives for legitimate local-component patterns).
        if (expr.type === 'ObjectExpression') {
          checkObjectExpression(context, expr);
        } else if (expr.type === 'ArrayExpression') {
          checkArrayExpression(context, expr);
        }
      },
    };
  },
};
