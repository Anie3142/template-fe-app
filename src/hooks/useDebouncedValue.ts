'use client';

import { useEffect, useState } from 'react';

/**
 * Debounces a value — returns the value only after `delay` ms have passed
 * since the last change.
 *
 * Use this for search inputs to avoid firing an API request on every keystroke.
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebouncedValue(search, 300);
 *
 * useQuery({
 *   queryKey: ['items', debouncedSearch],
 *   queryFn: () => api.getItems({ search: debouncedSearch }),
 * });
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
