import { useCallback, useEffect, useState } from "react";

export function useToggle(initial = false) {
  const [open, setOpen] = useState<boolean>(initial);
  const on = useCallback(() => setOpen(true), []);
  const off = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return { open, on, off, toggle } as const;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  }, [key, value]);
  return [value, setValue] as const;
}
