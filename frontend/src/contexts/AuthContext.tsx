import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

type User = {
  email: string;
  name: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
          { withCredentials: true }
        );
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
      setUser(null);
      toast.success("Logged out successfully!", {
        style: {
          background: "#0d0d0d",
          color: "#00ff9d",
          border: "1px solid #00ff9d50",
        },
      });
    } catch (err) {
      toast.error("Logout failed. Please try again.", {
        style: {
          background: "#0d0d0d",
          color: "#ff4444",
          border: "1px solid #ff444450",
        },
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
