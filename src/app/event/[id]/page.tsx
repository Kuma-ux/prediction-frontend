'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EventPage() {
  const { id } = useParams();

  const router = useRouter();

  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    loadEvent();
  }, []);

  async function loadEvent() {
    const res = await fetch(
      `https://api.theprobability.site/events/${id}`
    );

    const data = await res.json();

    if (data.success) {
      setEvent(data.event);
    }
  }

  if (!event) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-emerald-400">
      Loading event...
    </main>
  );
}

return (
  <main className="min-h-screen bg-black text-white">
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="mb-10">

        <div className="text-emerald-400 uppercase text-xs mb-3">
          {event.category}
        </div>

        <h1 className="text-4xl font-bold mb-3">
          {event.title}
        </h1>

        <p className="text-zinc-500 max-w-3xl">
          {event.description}
        </p>

      </div>

      {/* EVENT STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">

        <div className="bg-zinc-950 rounded-xl border border-white/10 p-5">
          <div className="text-zinc-500 text-sm">
            Markets
          </div>

          <div className="text-3xl font-bold">
            {event.markets.length}
          </div>
        </div>

        <div className="bg-zinc-950 rounded-xl border border-white/10 p-5">
          <div className="text-zinc-500 text-sm">
            Total Volume
          </div>

          <div className="text-3xl font-bold">
            KES {Number(event.totalvolume ?? 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-zinc-950 rounded-xl border border-white/10 p-5">
          <div className="text-zinc-500 text-sm">
            Resolves
          </div>

          <div className="font-bold">
            {event.end_date
              ? new Date(event.end_date).toLocaleDateString()
              : "Multiple dates"}
          </div>
        </div>

      </div>

      {/* MARKETS */}
      <div className="grid gap-5">

        {event.markets.map((market: any) => {

          const odds = market.odds ?? {};

          const leadingOutcome =
            Object.keys(odds).length
              ? Object.entries(odds).reduce(
                  (best: any, current: any) =>
                    current[1] > best[1] ? current : best
                )
              : null;

          return (

            <div
              key={market.id}
              onClick={() => router.push(`/market/${market.id}`)}
              className="
                cursor-pointer
                bg-zinc-950
                border
                border-white/10
                rounded-xl
                p-6
                hover:border-emerald-500/40
                transition
              "
            >

              <div className="flex justify-between">

                <div>

                  <h2 className="font-bold text-lg">
                    {market.title}
                  </h2>

                  <p className="text-zinc-500 mt-2">
                    {market.description}
                  </p>

                </div>

                {leadingOutcome && (
                  <div className="text-right">

                    <div className="text-zinc-500 text-xs">
                      Leading
                    </div>

                    <div className="text-emerald-400 font-bold text-xl">
                      {leadingOutcome[0]}
                    </div>

                    <div>
                      {(Number(leadingOutcome[1]) * 100).toFixed(0)}¢
                    </div>

                  </div>
                )}

              </div>

              <div className="flex justify-between mt-6 border-t border-white/10 pt-4">

                <div>

                  <div className="text-xs text-zinc-500">
                    Volume
                  </div>

                  <div>
                    KES {Number(market.totalvolume ?? 0).toLocaleString()}
                  </div>

                </div>

                <button
                  className="
                    bg-emerald-500
                    hover:bg-emerald-400
                    text-black
                    px-5
                    rounded-lg
                    font-bold
                  "
                >
                  Open Market →
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  </main>
);
}
