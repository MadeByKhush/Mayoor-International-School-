"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "@/components/ui/Toast";

export default function ClientProviders({ children }) {
    return (
        <AuthProvider>
            <ToastContainer />
            {children}
        </AuthProvider>
    );
}
