import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// This cookie is set by the backend on successful login (non-HTTP-only)
const clientAuthCookie = Cookies.get("clientAuth");

const initialState = {
  isAuthenticated: clientAuthCookie === "true"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
