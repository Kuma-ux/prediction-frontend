"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function resetPassword() {

    if (!token) {
      alert("Invalid password reset link.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        "https://prediction-backend-production-05b8.up.railway.app/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Unable to reset password.");
        return;
      }

      alert("Password changed successfully!");

      router.push("/login");

    } catch (err) {

      console.error(err);

      alert("Something went wrong.");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="w-full flex items-center justify-center px-6">

      <div
        className="
          w-full
          max-w-md
          bg-zinc-950
          border
          border-white/10
          rounded-3xl
          p-8
        "
      >

        <h1 className="text-3xl font-black text-white mb-2">
          Reset Password
        </h1>

        <p className="text-zinc-400 mb-8">
          Enter your new password below.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full
            bg-zinc-900
            text-white
            border
            border-white/10
            rounded-xl
            px-4
            py-3
            mb-4
            outline-none
            focus:border-emerald-500
          "
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="
            w-full
            bg-zinc-900
            text-white
            border
            border-white/10
            rounded-xl
            px-4
            py-3
            mb-6
            outline-none
            focus:border-emerald-500
          "
        />

        <button
          onClick={resetPassword}
          disabled={loading}
          className="
            w-full
            py-3
            rounded-xl
            bg-emerald-500
            text-black
            font-black
            hover:bg-emerald-400
            transition
            disabled:opacity-50
          "
        >
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>

      </div>

    </div>
  );
}
