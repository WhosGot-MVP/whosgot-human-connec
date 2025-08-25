// src/components/AuthProvider.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// ⬇️ добавили: модалка для имени
import { DisplayNamePrompt } from '@/components/ui/DisplayNamePrompt';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // ⬇️ состояние показа модалки “Как вас называть?”
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  // ---------- DEMO fallback ----------
  useEffect(() => {
    if (!supabase) {
      const storedUser = localStorage.getItem('whosgot-demo-user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setUser({
            id: u.id,
            email: u.email,
            created_at: u.created_at || new Date().toISOString(),
            updated_at: u.updated_at || new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated',
          } as User);
        } catch {
          localStorage.removeItem('whosgot-demo-user');
        }
      }
      setLoading(false);
    }
  }, []);
  // -----------------------------------

  // 1) первичная загрузка сессии
  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 2) обмен кода на сессию при возврате по magic link
  useEffect(() => {
    if (!supabase) return;

    (async () => {
      // Supabase добавляет ?code=...&type=...
      if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
        try {
          setLoading(true);
          await supabase.auth.exchangeCodeForSession(window.location.href);
          // подчистим URL от query
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
          console.error('exchangeCodeForSession failed', e);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, []);

  // 3) подписка на изменения сессии
  useEffect(() => {
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // 4) мягкая проверка имени в профиле → показать модалку один раз после логина
  useEffect(() => {
    if (!supabase || !user?.id) return;

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();

        if (error) return; // не мешаем UX, просто не показываем модалку
        const display = (data?.display_name ?? '').trim();
        const emailLocal = (user.email ?? '').split('@')[0];

        const looksPlaceholder =
          !display ||
          display.includes('@') ||
          display.toLowerCase() === emailLocal.toLowerCase() ||
          /^user\s+[0-9a-f]{4,}$/i.test(display);

        if (!cancelled) setShowNamePrompt(looksPlaceholder);
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]); // срабатывает при первом появлении user

  const signIn = async (email: string) => {
    setLoading(true);
    try {
      if (!supabase) {
        // DEMO режим
        const mock = {
          id: `demo-user-${Date.now()}`,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated',
          role: 'authenticated',
        } as User;
        localStorage.setItem('whosgot-demo-user', JSON.stringify(mock));
        setUser(mock);
        return;
      }

      const emailRedirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}${window.location.pathname}`
          : undefined;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo },
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        localStorage.removeItem('whosgot-demo-user');
        setUser(null);
        setSession(null);
        return;
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, session, loading, signIn, signOut }),
    [user, session, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Модалка имени: мягкая, ничего не ломает */}
      <DisplayNamePrompt
        open={showNamePrompt}
        onClose={() => setShowNamePrompt(false)}
        userId={user?.id}
      />
    </AuthContext.Provider>
  );
}

     

  

      



 
