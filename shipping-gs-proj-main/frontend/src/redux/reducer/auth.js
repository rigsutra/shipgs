// src/redux/reducer/auth.js
import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if available
const userFromStorage = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
  user: userFromStorage,
  isAdmin: userFromStorage?.role === "admin" || false, // Dynamically check role
  loader: false, // Initial loader state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.isAdmin = action.payload.role === "admin"; // Set isAdmin based on role
      state.loader = false;
      sessionStorage.setItem("user", JSON.stringify(action.payload)); // Store user in localStorage
    },
    userNotExists: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.loader = false;
      sessionStorage.removeItem("user"); // Clear user from localStorage
    },
    setLoader: (state, action) => {
      state.loader = action.payload; // Set loader state
    },
  },
});

export const { userExists, userNotExists, setLoader } = authSlice.actions;
export default authSlice.reducer;
