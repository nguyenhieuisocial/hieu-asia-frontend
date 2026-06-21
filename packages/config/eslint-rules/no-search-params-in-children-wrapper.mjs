/**
 * Hydration discipline ESLint rule — `no-search-params-in-children-wrapper`.
 *
 * Catches the intermittent-hydration regression we hit in production
 * (admin PR #470, 2026-06-20; mirrors apps/web's earlier "soft-404" fix):
 *
 *   A component that reads `useSearchParams()` AND wraps `{children}`
 *   (a provider / layout-style wrapper) intermittently de-opts hydration of
 *   the WHOLE route. `useSearchParams()` opts its component into client-side
 *   rendering; when that component sits high in the tree wrapping every page,
 *   the client-render bail races React's hydration. Symptom: the page renders
 *   (SSR HTML shows) but stays non-interactive — toggles dead, tabs inert,
 *   data-fetching effects never fire. Flaky (a race), so it slips through
 *   single-load smoke tests and only bites ~1/3 of production loads.
 *
 *   Real example (the bug this rule prevents):
 *     export function PostHogProvider({ children }) {
 *       const searchParams = useSearchParams();   // <-- de-opts {children}
 *       ...
 *       return <>{children}</>;
 *     }
 *
 *   Fix (what apps/web + apps/admin now do): isolate the search-param read in
 *   a LEAF component that returns null, wrap THAT in its own <Suspense>, and
 *   render {children} as a sibling — never inside the search-param reader:
 *     function PostHogPageView() {            // leaf, no children → fine
 *       const searchParams = useSearchParams();
 *       ...
 *       return null;
 *     }
 *     export function PostHogProvider({ children }) {
 *       return (<><Suspense fallback={null}><PostHogPageView /></Suspense>{children}</>);
 *     }
 *
 * HEURISTIC (intentionally narrow — keys on the wrapper signal, not just any
 * useSearchParams use):
 *   Flags a `useSearchParams()` CALL only when its enclosing function/component
 *   ALSO declares a `children` prop (first param is an ObjectPattern with a
 *   `children` key). A page/leaf that merely *uses* useSearchParams for its own
 *   query logic (no `children` prop) is the normal, safe pattern and is NOT
 *   flagged. The isolated leaf (PostHogPageView, returns null, no children) is
 *   likewise not flagged.
 *
 *   Only counts `useSearchParams` imported from 'next/navigation'.
 *
 * Refs:
 *   - memory://admin-arch-reactflow-hydration-race (root cause + fix)
 *   - memory://soft404-suspense-rootcause (apps/web's earlier instance)
 *   - PR #470 (admin fix)
 */

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

/** An ObjectPattern param that destructures a `children` key. */
function paramDestructuresChildren(param) {
  if (!param || param.type !== 'ObjectPattern') return false;
  return param.properties.some(
    (p) =>
      p.type === 'Property' &&
      p.key &&
      (p.key.name === 'children' || p.key.value === 'children'),
  );
}

/** Does this function node declare a `children` prop in its first param? */
function functionWrapsChildren(fn) {
  if (!fn || !Array.isArray(fn.params) || fn.params.length === 0) return false;
  return paramDestructuresChildren(fn.params[0]);
}

const FUNCTION_TYPES = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
]);

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow useSearchParams() inside a component that wraps {children}. Reading search params high in the tree intermittently de-opts hydration of the whole route. Isolate it in a Suspense-wrapped leaf component instead.',
      url: 'https://github.com/anthropics/claude-code/issues/hydration-discipline',
    },
    schema: [],
    messages: {
      searchParamsWrapper:
        'useSearchParams() is read here, but this component also wraps `children`. That intermittently de-opts hydration of the whole route (pages render but stay non-interactive — a flaky race). Move the search-param read into a leaf component that returns null, wrap it in its own <Suspense fallback={null}>, and render {children} as a sibling. See apps/web/admin PostHogProvider (PR #470).',
    },
  },
  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename;
    if (isStoryOrTestFile(filename)) return {};

    // Only act when useSearchParams is imported from next/navigation.
    let importsSearchParams = false;

    return {
      ImportDeclaration(node) {
        if (node.source && node.source.value === 'next/navigation') {
          for (const spec of node.specifiers) {
            if (
              spec.type === 'ImportSpecifier' &&
              spec.imported &&
              spec.imported.name === 'useSearchParams'
            ) {
              importsSearchParams = true;
            }
          }
        }
      },
      CallExpression(node) {
        if (!importsSearchParams) return;
        if (!node.callee || node.callee.type !== 'Identifier') return;
        if (node.callee.name !== 'useSearchParams') return;

        // Walk up to the nearest enclosing function component.
        const ancestors = context.sourceCode
          ? context.sourceCode.getAncestors(node)
          : context.getAncestors();
        for (let i = ancestors.length - 1; i >= 0; i--) {
          const a = ancestors[i];
          if (FUNCTION_TYPES.has(a.type)) {
            if (functionWrapsChildren(a)) {
              context.report({ node, messageId: 'searchParamsWrapper' });
            }
            return; // only inspect the innermost enclosing function
          }
        }
      },
    };
  },
};
