// Utilities
export { cn } from './lib/utils';

// Design tokens (Wave 60 — programmatic counterpart of tailwind-preset).
// Use for charts/SVG/PDF/non-Tailwind contexts. JSX should prefer Tailwind
// utility classes (bg-ink, text-gold, etc.). See `tokens.ts` for full docs.
export {
  colors,
  chartSeries,
  states as brandStates,
  fontFamilies,
  fontSizes,
  lineHeights,
  spacing,
  maxWidths,
  radii,
  durations,
  easings,
  breakpoints,
  shadows,
  forbiddenPhrases,
  wordmark,
  tagline,
  tokens,
} from './tokens';
export type { Tokens } from './tokens';

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

// Overlay & navigation primitives (Radix UI wrappers)
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/Dialog';
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './components/Tooltip';
export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
} from './components/Popover';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/Select';
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/Accordion';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './components/Sheet';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from './components/DropdownMenu';

// Display primitives
export { Skeleton } from './components/Skeleton';
export { Alert, AlertTitle, AlertDescription } from './components/Alert';
export { Textarea } from './components/Textarea';

// Toast notifications (sonner-backed)
export { toast } from './components/Toast';
export type { ExternalToast } from './components/Toast';
export { Toaster } from './components/Toaster';

// Domain components (custom, hieu.asia-specific)
export { ConsentCheckboxList } from './components/ConsentCheckboxList';
export type { ConsentItem } from './components/ConsentCheckboxList';
export { InsightCard } from './components/InsightCard';

// Brand identity — Logo system (wordmark / symbol / lockup, 4 variants)
export { Logo, Wordmark, SymbolMark, Lockup } from './components/Logo';
export type { LogoVariant, LogoKind } from './components/Logo';

// Admin / back-office primitives
export { DataTable, StatusBadge } from './components/DataTable';
export type { Column as DataTableColumn, DataTableProps } from './components/DataTable';
