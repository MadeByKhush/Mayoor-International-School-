"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  const loginNow = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass,
      });

      if (error) throw error;

      // Force cookie write manually right here so the next pushed route has it instantly
      if (data?.session?.access_token) {
        document.cookie = `sb-auth-token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; secure`;
      }

      // Allow a brief moment for the cookie to propagate before router push
      setTimeout(() => {
        router.push("/admin");
      }, 300);
    } catch (error) {
      console.error("Login error:", error.message);
      setErr("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">

      <form onSubmit={loginNow} className="w-full max-w-md">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 sm:p-6">

          <legend className="fieldset-legend text-lg sm:text-xl">Login</legend>

          {err && <p className="text-red-500 text-sm mb-2">{err}</p>}

          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered w-full pl-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label mt-2">Password</label>
          <input
            type="password"
            className="input input-bordered w-full pl-3"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-neutral mt-4 w-full hover:bg-primary hover:text-white">
            Login
          </button>
        </fieldset>
      </form>

    </div>
  );
}
