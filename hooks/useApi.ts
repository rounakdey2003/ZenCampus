import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiOptions {
  autoFetch?: boolean;
  params?: Record<string, string>;
}

export function useApi<T>(endpoint: string, options: UseApiOptions = { autoFetch: true }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paramsRef = useRef<Record<string, string> | undefined>(options.params);

  const fetchData = useCallback(async (params?: Record<string, string>) => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const url = new URL(endpoint, origin);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }
      
      const response = await fetch(url.toString());
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }
      
      setData(result.data);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const post = async (body: unknown) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create');
      }
      
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const put = async (id: string, body: unknown) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update');
      }
      
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const del = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete');
      }
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    if (options.autoFetch) {
      fetchData(paramsRef.current);
    }
  }, [options.autoFetch, endpoint]);

  return { data, loading, error, refetch: fetchData, post, put, del };
}
