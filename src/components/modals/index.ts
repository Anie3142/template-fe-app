// Lazy-load modals via next/dynamic. Modals are interaction-triggered (clicks),
// so they don't need to be in the initial JS bundle. This shaves chunks off the
// initial bundle for every page that imports them.
//
// Pattern: each modal renders a closed Dialog by default, so when the parent
// page imports it the user pays no chunk cost until they actually open it.
import dynamic from 'next/dynamic';

export const ExampleModal = dynamic(
  () => import('./ExampleModal').then((m) => m.ExampleModal),
  { ssr: false },
);
