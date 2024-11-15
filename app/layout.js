"use client";

import { Provider } from "react-redux";
import store from "../store";
import Navbar from "../components/Navbar";
import "./globals.css";
import TestPage from "@/components/TestPage";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Navbar />
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
