"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit() {

    const res = await fetch(
      "http://localhost:5000/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          username,
          email
        })
      }
    );

    const data = await res.json();

    alert(data.message);
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10">

        <h1 className="text-3xl font-bold mb-2">
          Forgot Password
        </h1>

        <p className="text-zinc-400 mb-6">
          Enter your username and email address.
          If they match an account, we'll send you a password reset link.
        </p>

        <input
          placeholder="Username"
          className="w-full p-3 mb-3 bg-zinc-900 rounded-lg border border-white/10"
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full p-3 mb-6 bg-zinc-900 rounded-lg border border-white/10"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-emerald-500 text-black font-bold p-3 rounded-lg"
        >
          Send Reset Link
        </button>

      </div>

    </div>

  );

}