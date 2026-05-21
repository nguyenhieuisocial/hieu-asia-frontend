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

// Admin / back-office primitives
export { DataTable, StatusBadge } from './components/DataTable';
export type { Column as DataTableColumn, DataTableProps } from './components/DataTable';
