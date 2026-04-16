import { useEffect, useState } from 'react';

export default function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return initialValue;
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
