import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // LOAD USER FROM TOKEN
  // =====================================

  useEffect(() => {
    const loadUser = async () => {
      const token =
        localStorage.getItem(
          "flowboard_token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data =
          await api.get("/auth/me");

        setUser(data.user);
      } catch (error) {
        console.error(
          "Session expired:",
          error.message
        );

        localStorage.removeItem(
          "flowboard_token"
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // =====================================
  // REGISTER
  // =====================================

  const register = async ({
    name,
    email,
    password,
  }) => {
    const data = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

    localStorage.setItem(
      "flowboard_token",
      data.token
    );

    setUser(data.user);

    return data;
  };

  // =====================================
  // LOGIN
  // =====================================

  const login = async ({
    email,
    password,
  }) => {
    const data = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "flowboard_token",
      data.token
    );

    setUser(data.user);

    return data;
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {
    localStorage.removeItem(
      "flowboard_token"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}