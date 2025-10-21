import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/reduxStoreHooks";
import { JSX, useState } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, token } = useAppSelector((state) => state.auth); // Access user from Redux state
  const isAuthenticated = user && token;
  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" state={{ from: useLocation() }} />;
  }
};

export default ProtectedRoute;
