"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewsLanding() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl p-10">

        <div className="text-center">

          <div className="text-6xl mb-6">
            📰
          </div>

          <h1 className="text-4xl font-black mb-4">
            Stay Ahead of the Crowd
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            The best predictors are the best informed.
            <br /><br />
            Receive breaking market news, company analysis,
            sports previews, economic updates,
            crypto insights and political developments directly
            in your inbox.
          </p>

        </div>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="
            w-full
            bg-black
            border
            border-white/10
            rounded-2xl
            px-5
            py-4
            mb-6
            outline-none
            focus:border-emerald-500
          "
        />

        <button
          className="
            w-full
            bg-emerald-500
            hover:bg-emerald-400
            text-black
            font-bold
            rounded-2xl
            py-4
            transition
          "
        >
          Subscribe & Continue
        </button>

        <button
          onClick={() => router.push("/news/blog")}
          className="
            w-full
            mt-4
            text-zinc-400
            hover:text-white
          "
        >
          Skip for now
        </button>

      </div>

    </main>
  );
}
