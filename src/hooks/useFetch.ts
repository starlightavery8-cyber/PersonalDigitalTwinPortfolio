import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useFetch<T>(
  table: string,
  orderColumn: string,
  ascending = true,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const { data: rows, error: err } = await supabase
        .from(table)
        .select('*')
        .order(orderColumn, { ascending });

      if (cancelled) return;
      if (err) setError(err.message);
      else setData((rows as T[]) ?? []);
      setLoading(false);
    }

    run();
    return () => { cancelled = true; };
  }, [table, orderColumn, ascending]);

  return { data, loading, error };
}
