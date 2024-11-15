"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../store/authSlice";
import { logoutUser } from "@/utils/api";

export default function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out?")) return;

    setLoading(true);
    try {
      await logoutUser();
      dispatch(logout());
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1
          className="text-white font-bold text-xl cursor-pointer"
          onClick={() => router.push("/")}
        >
          LMS Home
        </h1>
        <div className="space-x-4">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className={`btn btn-logout ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
