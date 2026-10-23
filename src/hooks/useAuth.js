import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { getCurrentUser, onAuthChange } from '../services/auth.js';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    let active = true;
    getCurrentUser()
      .then((currentUser) => active && setUser(currentUser))
      .finally(() => active && setLoading(false));

    const unsubscribe = onAuthChange(setUser);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { user, loading };
}
