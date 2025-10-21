import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/reduxStoreHooks";
import { JSX } from "react";

const SAProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, token } = useAppSelector((state) => state.auth); // Access user from Redux state
  const isAuthenticatedAndUser = user && token && user.role === "SUPPORT_AGENT";
  if (isAuthenticatedAndUser) {
    return children;
  } else {
    return <Navigate to="/login" state={{ from: useLocation() }} />;
  }
};

export default SAProtectedRoute;
