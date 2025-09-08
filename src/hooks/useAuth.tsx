import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { login as apiLogin, getMe, logout as apiLogout } from '@/services/auth';

interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await apiLogin({ email, password });
      localStorage.setItem('auth_token', result.token);
      setUser(result.user);
      toast({ title: "تم تسجيل الدخول بنجاح", description: "مرحباً بك في لوحة التحكم" });
      return { error: null };
    } catch (e: any) {
      toast({ title: "خطأ في تسجيل الدخول", description: e.message || 'Login failed', variant: "destructive" });
      return { error: e };
    }
  };

  const signOut = async () => {
    try {
      await apiLogout();
    } catch (_) {
      // ignore network errors on logout
    }
    localStorage.removeItem('auth_token');
    setUser(null);
    toast({ title: "تم تسجيل الخروج", description: "نراك قريباً" });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}