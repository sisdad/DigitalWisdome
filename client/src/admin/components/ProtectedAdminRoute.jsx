import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext";

export default function ProtectedAdminRoute() {
  const {
    isAuthenticated,
    loading,
  } = useAdminAuth();

  const location = useLocation();

  // ============================================================
  // WAIT FOR SESSION RESTORATION
  // ============================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05070a",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid rgba(255,255,255,0.2)",
              borderTopColor: "#ffffff",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "admin-spin 0.8s linear infinite",
            }}
          />

          <div>Checking administrator session...</div>
        </div>

        <style>
          {`
            @keyframes admin-spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // ============================================================
  // NOT AUTHENTICATED
  // ============================================================

  if (!isAuthenticated) {
    const returnPath =
      `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: returnPath,
        }}
      />
    );
  }

  // ============================================================
  // AUTHENTICATED
  // ============================================================

  return <Outlet />;
}