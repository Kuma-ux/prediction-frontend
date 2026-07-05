'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProfile();
  }, [username]);

  async function loadProfile() {
    try {
      const res = await fetch(
        `http://localhost:5000/profile/${username}`
      );

      const data = await res.json();

      if (data.success) {
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading profile...
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Profile not found
      </main>
    );
  }

  const filteredActive =
    profile.activePositions.filter((p: any) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

  const filteredClosed =
    profile.closedPositions.filter((p: any) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}

      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="flex items-center gap-5">

            {profile.user.avatar_url ? (
              <img
                src={`http://localhost:5000${profile.user.avatar_url}`}
                alt={profile.user.username}
                className="
                  w-20
                  h-20
                  rounded-full
                  object-cover
                  border
                  border-white/10
                "
              />
            ) : (
              <div
                className="
                  w-20
                  h-20
                  rounded-full
                  bg-emerald-500
                  flex
                  items-center
                  justify-center
                  text-black
                  text-3xl
                  font-black
                "
              >
                {profile.user.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-5xl font-black">
                @{profile.user.username}
              </h1>

              <p className="text-zinc-500 mt-2">
                Joined{" "}
                {new Date(
                  profile.user.joined
                ).toLocaleDateString()}
              </p>

              <p className="text-zinc-400 mt-3 max-w-xl">
                {profile.user.bio || "No bio yet."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TOP CARDS */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-2 gap-6">

          {/* STATS */}

          <div className="
            bg-zinc-950
            border
            border-white/10
            rounded-3xl
            p-8
          ">

            <h2 className="text-2xl font-bold mb-6">
              Profile Statistics
            </h2>

            <div className="grid grid-cols-2 gap-6">

              <Stat
                label="Predictions"
                value={profile.user.predictions}
              />

              <Stat
                label="Biggest Trade"
                value={`K${(profile.user.biggestWin ?? 0).toFixed(2)}`}
              />

              <Stat
                label="Active Positions"
                value={profile.user.activePositions}
              />

              <Stat
                label="Closed Positions"
                value={profile.user.closedPositions}
              />

            </div>

          </div>

          {/* PROFIT LOSS */}

          <div className="
            bg-zinc-950
            border
            border-white/10
            rounded-3xl
            p-8
          ">

            <h2 className="text-2xl font-bold mb-4">
              Profit / Loss
            </h2>

            <div className="
              text-5xl
              font-black
              text-emerald-400
              mb-6
            ">
              K{(profile.user.profitLoss ?? 0).toFixed(2)}
            </div>

            <div className="h-[220px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={profile.equityCurve}
                >
                  <XAxis dataKey="date" hide />
                  <YAxis hide />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="value"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

            </div>

          </div>

        </div>
      </section>

      {/* SEARCH */}

      <section className="max-w-7xl mx-auto px-6 mb-10">

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search positions..."
          className="
            w-full
            bg-zinc-950
            border
            border-white/10
            rounded-2xl
            px-5
            py-4
            outline-none
            focus:border-emerald-500
          "
        />

      </section>

      {/* ACTIVE POSITIONS */}

      <section className="max-w-7xl mx-auto px-6 mb-12">

        <h2 className="text-3xl font-bold mb-6">
          Active Positions
        </h2>

        <div className="space-y-4">

          {filteredActive.map((position: any) => (

            <div
              key={position.id}
              className="
                bg-zinc-950
                border
                border-white/10
                rounded-2xl
                p-5
              "
            >
              <div className="font-bold text-lg">
                {position.title}
              </div>

              <div className="text-zinc-500 mt-2">
                Outcome: {position.outcome}
              </div>

              <div className="text-zinc-500">
                Shares: {position.shares}
              </div>

              <div className="text-zinc-500">
                Avg Cost: K
                {Number(position.avg_cost).toFixed(2)}
              </div>
            </div>

          ))}

        </div>

      </section>

      {/* CLOSED POSITIONS */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <h2 className="text-3xl font-bold mb-6">
          Closed Positions
        </h2>

        <div className="space-y-4">

          {filteredClosed.map((position: any) => (

            <div
              key={position.id}
              className="
                bg-zinc-950
                border
                border-white/10
                rounded-2xl
                p-5
              "
            >
              <div className="font-bold text-lg">
                {position.title}
              </div>

              <div className="text-zinc-500 mt-2">
                Outcome: {position.outcome}
              </div>

              <div className="text-zinc-500">
                Winning Outcome:
                {" "}
                {position.winning_outcome}
              </div>

              <div className="text-zinc-500">
                Shares:
                {" "}
                {position.shares}
              </div>
            </div>

          ))}

        </div>

      </section>

    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div>
      <div className="text-zinc-500 text-sm">
        {label}
      </div>

      <div className="text-3xl font-black mt-2">
        {value}
      </div>
    </div>
  );
}