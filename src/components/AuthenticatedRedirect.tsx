// src/components/AuthenticatedRedirect.tsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../store/store";

interface AuthenticatedRedirectProps {
  children: React.ReactNode;
}

export const AuthenticatedRedirect: React.FC<AuthenticatedRedirectProps> = ({
  children,
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Render nothing while redirecting to prevent page flicker
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
