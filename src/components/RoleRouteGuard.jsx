import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

export default function RoleRouteGuard({
  allowedRoles,
  children,
  strict = false,
}) {
  const { role, loading } = useUserContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isAllowed = strict
    ? allowedRoles.includes(role)
    : role === "Super Admin" || allowedRoles.includes(role);

  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
