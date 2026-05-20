// Utilities
export { cn } from './lib/utils';

// shadcn/ui primitives (re-export — actual components added by `pnpm dlx shadcn add`
// at install-time. Stubs below are minimal so the package builds before that.)
export { Button } from './components/Button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card';
export { Input } from './components/Input';
export { Label } from './components/Label';
export { Checkbox } from './components/Checkbox';
export { RadioGroup, RadioGroupItem } from './components/RadioGroup';
export { Slider } from './components/Slider';
export { Switch } from './components/Switch';

// Domain components (custom, hieu.asia-specific)
export { ConsentCheckboxList } from './components/ConsentCheckboxList';
export type { ConsentItem } from './components/ConsentCheckboxList';
export { InsightCard } from './components/InsightCard';

// Admin / back-office primitives
export { DataTable, StatusBadge } from './components/DataTable';
export type { Column as DataTableColumn, DataTableProps } from './components/DataTable';
