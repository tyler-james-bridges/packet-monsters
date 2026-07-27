import type { AppEvents, EventBus } from './types';

export function createBus(): EventBus {
  const map = new Map<string, Set<(p: unknown) => void>>();
  return {
    on(k, fn) {
      const key = k as string;
      let set = map.get(key);
      if (!set) {
        set = new Set();
        map.set(key, set);
      }
      set.add(fn as (p: unknown) => void);
      return () => set!.delete(fn as (p: unknown) => void);
    },
    off(k, fn) {
      map.get(k as string)?.delete(fn as (p: unknown) => void);
    },
    emit<K extends keyof AppEvents>(k: K, p: AppEvents[K]) {
      const set = map.get(k as string);
      if (!set) return;
      for (const fn of Array.from(set)) (fn as (q: AppEvents[K]) => void)(p);
    },
  };
}
