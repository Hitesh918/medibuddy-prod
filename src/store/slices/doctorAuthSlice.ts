import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  hospital?: string;
  experience?: number;
  isVerified?: boolean;
}

interface DoctorAuthState {
  doctor: Doctor | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: DoctorAuthState = {
  doctor: null,
  token: null,
  isAuthenticated: false,
};

const doctorAuthSlice = createSlice({
  name: "doctorAuth",
  initialState,
  reducers: {
    setDoctorCredentials: (
      state,
      action: PayloadAction<{ doctor: Doctor; token: string }>
    ) => {
      state.doctor = action.payload.doctor;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Save to localStorage
      localStorage.setItem("doctorToken", action.payload.token);
      localStorage.setItem("doctor", JSON.stringify(action.payload.doctor));
    },

    doctorLogout: (state) => {
      state.doctor = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("doctorToken");
      localStorage.removeItem("doctor");
    },

    loadDoctorFromStorage: (state) => {
      const token = localStorage.getItem("doctorToken");
      const doctorStr = localStorage.getItem("doctor");

      if (token && doctorStr) {
        try {
          state.token = token;
          state.doctor = JSON.parse(doctorStr);
          state.isAuthenticated = true;
        } catch (error) {
          console.error("Error loading doctor from storage:", error);
          state.doctor = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
  },
});

export const { setDoctorCredentials, doctorLogout, loadDoctorFromStorage } =
  doctorAuthSlice.actions;

export default doctorAuthSlice.reducer;
