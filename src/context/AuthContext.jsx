"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.access_token) {
                document.cookie = `sb-auth-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; secure`;
            }
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);

                // Sync session to cookies for Next.js Middleware to read
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if (session?.access_token) {
                        document.cookie = `sb-auth-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; secure`;
                    }
                } else if (event === 'SIGNED_OUT') {
                    document.cookie = `sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        session,
        user,
        loading,
        signOut: () => supabase.auth.signOut(),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
