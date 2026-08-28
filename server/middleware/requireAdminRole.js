// ============================================================
// ADMIN ROLE AUTHORIZATION
// ============================================================

export function requireAdminRole(
  ...allowedRoles
) {
  return (req, res, next) => {
    // ----------------------------------------------------------
    // AUTHENTICATION CHECK
    // ----------------------------------------------------------

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    // ----------------------------------------------------------
    // ROLE CHECK
    // ----------------------------------------------------------

    if (
      !allowedRoles.includes(
        req.admin.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to perform this action.",
      });
    }

    next();
  };
}