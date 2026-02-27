"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
import { getCurrentUser } from "../utils/api";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser()
      .then(() => dispatch(setAuth(true)))
      .catch(() => dispatch(setAuth(false)));
  }, [dispatch]);

  return null;
}