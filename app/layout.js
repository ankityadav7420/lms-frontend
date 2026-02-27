"use client";

import { Provider } from "react-redux";
import store from "../store";
import Navbar from "../components/Navbar";
import AuthInitializer from "../components/AuthInitializer";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthInitializer />
          <Navbar />
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}