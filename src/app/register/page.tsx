// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { registerUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleRegister() {

    if (username.length < 3) {
      alert("Username too short");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    
    const res = await registerUser(
      email.trim().toLowerCase(),
      password,
      username.trim()
    );

    if (res.success) {
        alert("Account created!");
      router.push("/login");
    } else {
      alert(res.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 border border-white/10 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Create Account</h1>

        <input
          className="w-full p-3 mb-3 bg-zinc-900 border border-white/10 rounded-lg"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          value={email}
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

        <button
          onClick={handleRegister}
          className="w-full bg-emerald-500 text-black font-bold p-3 rounded-lg"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
