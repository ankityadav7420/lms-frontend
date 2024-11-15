import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const tokenFromCookie = Cookies.get("token"); // Retrieve token from cookies

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!tokenFromCookie,
    token: tokenFromCookie || null
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      Cookies.remove("token"); // Remove token from cookies on logout
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
