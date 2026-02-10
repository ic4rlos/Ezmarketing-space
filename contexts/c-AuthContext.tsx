import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type CompanyUser = {
  id: string;
  email: string;
  companyId: string;
};

type AuthContextType = {
  user: CompanyUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function CAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CompanyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const userData = {
        id: payload.sub,
        email: payload.email,
        companyId: payload.companyId,
      };

      setUser(userData);
      
      // Salva o userId no localStorage para usar no Plasmic
      localStorage.setItem('userId', userData.id);
      
    } catch (err) {
      console.error("Token inválido", err);
      setUser(null);
      localStorage.removeItem('userId'); // Remove se token inválido
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCAuth() {
  return useContext(AuthContext);
}
