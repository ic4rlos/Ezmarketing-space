import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import supabaseCompany from "../../lib/c-supabaseClient";

type AuthContextType = {
  userId: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseCompany.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ userId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
