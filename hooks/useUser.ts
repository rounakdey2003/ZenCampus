import { useEffect, useState } from "react";

export interface UserData {
  usn: string;
  name: string;
  email: string;
  roomNumber: string;
  role: string;
}

/**
 * Custom hook to fetch current user data from session
 */
export function useUser() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/auth/me");
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
