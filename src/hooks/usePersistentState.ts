import { useEffect, useState } from 'react';

/**
 * useState sauvegardé dans le localStorage. `serialize` / `deserialize` permettent de ne stocker
 * que des identifiants (ex. panier) et de les réhydrater depuis le catalogue courant.
 */
export function usePersistentState<T, S = T>(
  key: string,
  fallback: T,
  serialize: (value: T) => S = (v) => v as unknown as S,
  deserialize: (stored: S) => T = (s) => s as unknown as T
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? deserialize(JSON.parse(raw) as S) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(serialize(value)));
    } catch {
      // stockage indisponible (navigation privée…) : l'app fonctionne sans persistance
    }
    // serialize est stable par appelant ; on ne suit que la valeur
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  return [value, setValue] as const;
}
