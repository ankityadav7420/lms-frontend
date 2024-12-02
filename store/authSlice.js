import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const tokenFromCookie = Cookies.get("token");
const initialState = {
  isAuthenticated: !!tokenFromCookie,
  token: tokenFromCookie || null
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
