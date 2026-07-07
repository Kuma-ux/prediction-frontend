'use client';

import Link from "next/link";
import { useState } from "react";

export default function UserPreview({
  username,
}: {
  username: string;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadProfile() {
    if (loaded) return;

    try {
      const res = await fetch(
        `https://api.theprobability.site/users/${username}/preview`
      );

      const data = await res.json();

      if (data.success) {
        setProfile(data.user);
      }

      setLoaded(true);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => {
        setShow(true);
        loadProfile();
      }}
      onMouseLeave={() => setShow(false)}
    >
      <Link
        href={`/profile/${username}`}
        className="
          text-emerald-400
          font-semibold
          hover:text-emerald-300
          transition
        "
      >
        @{username}
      </Link>

      {show && profile && (
        <div
          className="
            absolute
            bottom-full
            left-0
            mb-2
            w-72
            z-50
            bg-zinc-950
            border
            border-white/10
            rounded-2xl
            p-4
            shadow-2xl
          "
        >
          <div className="mb-3">
            <div className="font-bold text-white text-lg">
              @{profile.username}
            </div>

            <div className="text-xs text-zinc-500">
              Trader Preview
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">

            <div>
              <div className="font-bold text-white">
                {profile.predictions}
              </div>

              <div className="text-zinc-500 text-xs">
                Predictions
              </div>
            </div>

            <div>
              <div className="font-bold text-emerald-400">
                $
                {Number(
                  profile.biggestWin || 0
                ).toFixed(2)}
              </div>

              <div className="text-zinc-500 text-xs">
                Biggest Win
              </div>
            </div>

            <div>
              <div
                className={
                  Number(profile.profitLoss) >= 0
                    ? "font-bold text-emerald-400"
                    : "font-bold text-red-400"
                }
              >
                $
                {Number(
                  profile.profitLoss || 0
                ).toFixed(2)}
              </div>

              <div className="text-zinc-500 text-xs">
                P/L
              </div>
            </div>

          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-zinc-500">
            Click to view full profile →
          </div>
        </div>
      )}
    </div>
  );
}
