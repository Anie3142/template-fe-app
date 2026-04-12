// Lazy-load all charts via next/dynamic so Recharts (~300KB) is only pulled
// into the bundle when a chart is actually rendered. This dramatically shrinks
// the initial JS for pages that don't use charts, and defers chart hydration
// on pages that do so the page becomes interactive faster.
//
// IMPORTANT: this file MUST be `.tsx` (not `.ts`) because the loading fallbacks
// return JSX.
import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

const ChartSkeleton = ({ height = 240 }: { height?: number }) => (
  <Skeleton className="w-full" style={{ height }} />
);

export const LineChart = dynamic(
  () => import('./LineChart').then((m) => m.LineChart),
  { ssr: false, loading: () => <ChartSkeleton height={240} /> },
);

export const BarChart = dynamic(
  () => import('./BarChart').then((m) => m.BarChart),
  { ssr: false, loading: () => <ChartSkeleton height={240} /> },
);
