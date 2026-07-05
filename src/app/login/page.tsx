// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await loginUser(email, password);

    if (res.success) {
      alert("Login successful!");
      router.push("/");
    } else {
      alert(res.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 border border-white/10 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>

        <input
          className="w-full p-3 mb-3 bg-zinc-900 border border-white/10 rounded-lg"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 mb-5 bg-zinc-900 border border-white/10 rounded-lg"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end mb-5">
          <Link
            href="/forgot-password"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-emerald-500 text-black font-bold p-3 rounded-lg"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}