import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  signOut: async () => {},
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 CHANGE THIS TO YOUR REAL ADMIN EMAIL
  const ADMIN_EMAIL = "admin@example.com";

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      setLoading(true);

      // 1. Get session on load (CRITICAL FOR VERCEL FIX)
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth session error:", error.message);
      }

      if (mounted) {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    };

    initAuth();

    // 2. Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}