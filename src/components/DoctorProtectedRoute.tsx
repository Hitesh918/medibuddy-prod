import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store/store";
import { loadDoctorFromStorage } from "../store/slices/doctorAuthSlice";

interface DoctorProtectedRouteProps {
  children: React.ReactNode;
}

export const DoctorProtectedRoute: React.FC<DoctorProtectedRouteProps> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.doctorAuth
  );

  useEffect(() => {
    // Try to load doctor from storage on mount
    dispatch(loadDoctorFromStorage());
  }, [dispatch]);

  if (!isAuthenticated) {
    // Redirect to doctor login, but save the location they were trying to access
    return <Navigate to="/doctor/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
