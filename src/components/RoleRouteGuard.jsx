import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { getAccessToken } from "../lib/apiClient";

export default function RoleRouteGuard({
  allowedRoles,
  children,
  strict = false,
  fallbackUrl,
}) {
  const { role, userProfile, loading } = useUserContext();

  // If initializing session or token exists but userProfile is still loading, wait!
  if (loading || (!!getAccessToken() && !userProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated at all
  if (!userProfile) {
    if (allowedRoles.includes("Affiliate")) {
      return <Navigate to="/affiliate/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const isAllowed = strict
    ? allowedRoles.includes(role)
    : role === "Super Admin" || allowedRoles.includes(role);

  if (!isAllowed) {
    if (allowedRoles.includes("Affiliate")) {
      return <Navigate to="/affiliate/login" replace />;
    }
    return <Navigate to={fallbackUrl || "/dashboard"} replace />;
  }

  return children;
}
