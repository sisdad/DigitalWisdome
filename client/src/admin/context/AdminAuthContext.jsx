import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getAdminToken,
  loginAdmin as apiLoginAdmin,
  logoutAdmin as apiLogoutAdmin,
} from "../services/adminApi";

const AdminAuthContext = createContext(null);

const SESSION_EXPIRED_EVENT =
  "digital-wisdom-admin-session-expired";

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // SESSION EXPIRATION LISTENER
  // ============================================================

  useEffect(() => {
    function handleSessionExpired() {
      setAdmin(null);
      setLoading(false);
    }

    window.addEventListener(
      SESSION_EXPIRED_EVENT,
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        SESSION_EXPIRED_EVENT,
        handleSessionExpired
      );
    };
  }, []);

  // ============================================================
  // RESTORE AUTHENTICATION FROM LOCAL STORAGE
  // ============================================================

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const parts = token.split(".");

      if (parts.length !== 3) {
        throw new Error("Invalid token format.");
      }

      const payload = JSON.parse(
        atob(parts[1])
      );

      if (
        payload.type !== "admin" ||
        !payload.sub ||
        !payload.email ||
        !payload.role
      ) {
        throw new Error("Invalid admin token.");
      }

      if (
        payload.exp &&
        payload.exp * 1000 <= Date.now()
      ) {
        apiLogoutAdmin();
        setAdmin(null);
        setLoading(false);
        return;
      }

      setAdmin({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      });
    } catch (error) {
      console.error(
        "ADMIN SESSION RESTORE ERROR:",
        error
      );

      apiLogoutAdmin();
      setAdmin(null);
    }

    setLoading(false);
  }, []);

  // ============================================================
  // LOGIN
  // ============================================================

  async function login(email, password) {
    const response = await apiLoginAdmin(
      email,
      password
    );

    if (response.admin) {
      setAdmin(response.admin);
    }

    return response;
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  function logout() {
    apiLogoutAdmin();
    setAdmin(null);
  }

  const value = {
    admin,
    loading,
    isAuthenticated: Boolean(admin),
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider."
    );
  }

  return context;
}