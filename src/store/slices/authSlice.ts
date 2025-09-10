import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
}

// Define the shape of the authentication state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Load user and token from localStorage for the initial state
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to set credentials on login
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Also save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    // Action to clear credentials on logout
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Also clear from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
