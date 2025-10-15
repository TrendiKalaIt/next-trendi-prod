"use client";
import { Toaster } from "react-hot-toast";

export default function ClientToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        // Default style for all toasts
        style: {
          background: "#333", 
          color: "#fff", 
          borderRadius: "8px",
          padding: "10px 16px",
          fontSize: "14px",
        },
        // Success toast style
        success: {
          style: {
            background: "#9CAF88",
          },
          iconTheme: {
            primary: "white",
            secondary: "#4CAF50",
          },
        },
        // Error toast style
        error: {
          style: {
            background: "#FF4D4D",
          },
          iconTheme: {
            primary: "white",
            secondary: "#FF4D4D",
          },
        },
        // Duration settings
        duration: 3000,
      }}
    />
  );
}
