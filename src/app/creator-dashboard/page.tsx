"use client";

import { useEffect, useState } from "react";

export default function CreatorDashboard() {

  const [stats, setStats] =
    useState<any>(null);

  const [markets, setMarkets] =
    useState<any[]>([]);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    const res = await fetch(
      "https://prediction-backend-production-05b8.up.railway.app/creator/dashboard",
      {
        credentials: "include"
      }
    );

    const data = await res.json();

    if (!data.success) return;

    setStats(data.stats);
    setMarkets(data.markets);
  }

  if (!stats) {
    return (
      <div className="p-10 text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-5xl font-black mb-10">
          Creator Dashboard
        </h1>

        {/* STATS */}

        <div className="
          grid
          md:grid-cols-4
          gap-4
          mb-10
        ">

          <StatCard
            title="Markets Created"
            value={stats.totalMarkets}
          />

          <StatCard
            title="Live Markets"
            value={stats.liveMarkets}
          />

          <StatCard
            title="Pending Approval"
            value={stats.pendingMarkets}
          />

          <StatCard
            title="Approved"
            value={stats.approvedMarkets}
          />

          <StatCard
            title="Rejected"
            value={stats.rejectedMarkets}
          />

          <StatCard
            title="Total Creator Revenue"
            value={`K${Number(
                stats.totalIncome || 0
            ).toFixed(2)}`}
          />

          <StatCard
            title="Total Volume"
            value={`K${Number(
                stats.totalVolume || 0
            ).toFixed(2)}`}
          />

        </div>

        {/* MARKET TABLE */}

        <div className="
          bg-zinc-950
          border
          border-white/10
          rounded-3xl
          overflow-hidden
        ">

          <div
            className="
              grid
              grid-cols-5
              p-5
              font-bold
              border-b
              border-white/10
              text-zinc-400
            "
          >
            <div>Market</div>
            <div>Status</div>
            <div>Outcome</div>
            <div>Income</div>
            <div>Payout</div>
          </div>

          {markets.map((market) => (

            <div
              key={market.id}
              className="
                grid
                grid-cols-5
                p-5
                border-b
                border-white/10
                items-between
              "
            >

              <div>

                <div className="font-bold">
                  {market.title}
                </div>

                <div className="text-zinc-500">

                  #{market.id}

                </div>

              </div>

              <div>

                {market.resolved ? (

                    <span className="text-emerald-400">
                        Resolved
                    </span>
                ) : (

                    <span className="text-yellow-400">
                        Live
                    </span>
                )}

              </div>

              <div>
                {market.outcome || "-"}
              </div>

              <div className="font-bold text-emerald-400">

                K
                {Number(
                    market.creator_income || 0
                ).toFixed(2)}

              </div>

              <div>

                {market.creator_paid ? (
                    <span className="text-emerald-400">
                        Paid
                    </span>
                ) : (

                    <span className="text-yellow-400">
                        Unpaid
                    </span>
                )}

            </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div
      className="
        bg-zinc-950
        border
        border-white/10
        rounded-2xl
        p-6
      "
    >
      <div className="text-zinc-500">
        {title}
      </div>

      <div className="text-4xl font-black mt-2">
        {value}
      </div>
    </div>
  );
}
