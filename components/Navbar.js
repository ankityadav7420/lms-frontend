"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../store/authSlice";
import { loginUser } from "@/utils/api";

export default function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    loginUser();
    router.push("/");
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
              className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
