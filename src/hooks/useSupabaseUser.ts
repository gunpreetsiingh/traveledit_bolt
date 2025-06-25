import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';

/**
 * Custom React hook to get the currently logged-in Supabase user.
 * It returns the user object or null if not logged in, along with a loading state.
 *
 * This hook listens to Supabase authentication state changes to provide real-time updates.
 *
 * @returns {{ user: SupabaseAuthUser | null, loading: boolean }} An object containing the current user and a loading flag.
 */
export function useSupabaseUser() {
  const [user, setUser] = useState<SupabaseAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch the initial user session
    const fetchInitialUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching initial user:', error);
          setUser(null);
        } else {
          setUser(authUser);
        }
      } catch (err) {
        console.error('Unexpected error during initial user fetch:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialUser();

    // Set up a listener for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Update the user state whenever the auth state changes (e.g., login, logout)
      setUser(session?.user || null);
      setLoading(false); // Ensure loading is false after any auth state change
    });

    // Clean up the subscription when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return { user, loading };
}