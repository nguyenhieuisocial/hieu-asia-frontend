// Utilities
export { cn } from './lib/utils';

// shadcn/ui primitives (re-export — actual components added by `pnpm dlx shadcn add`
// at install-time. Stubs below are minimal so the package builds before that.)
export { Button } from './components/Button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card';

// Domain components (custom, hieu.asia-specific)
export { ConsentCheckboxList } from './components/ConsentCheckboxList';
export type { ConsentItem } from './components/ConsentCheckboxList';
export { InsightCard } from './components/InsightCard';
