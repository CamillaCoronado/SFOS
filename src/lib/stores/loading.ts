import { writable, derived, type Readable } from 'svelte/store';

const counts = writable(new Map<string, number>());

export const isLoading = derived(counts, (m) => [...m.values()].some(v => v > 0));
export const loadingFor = (key: string): Readable<boolean> =>
  derived(counts, (m) => (m.get(key) ?? 0) > 0);

export function start(key = 'global') {
  counts.update(m => {
    const n = (m.get(key) ?? 0) + 1;
    const next = new Map(m);
    next.set(key, n);
    return next;
  });
}

export function stop(key = 'global') {
  counts.update(m => {
    const n = (m.get(key) ?? 0) - 1;
    const next = new Map(m);
    if (n <= 0) next.delete(key); else next.set(key, n);
    return next;
  });
}

export async function withLoading<T>(fn: () => Promise<T>, key = 'global') {
  start(key);
  try { return await fn(); }
  finally { stop(key); }
}
