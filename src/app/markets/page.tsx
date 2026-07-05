'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketsPage() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Trending");

  const router = useRouter();

  useEffect(() => {
    async function loadMarkets() {
      const res = await fetch(
        "http://localhost:5000/markets",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        setMarkets(data.markets);
      }
    }

    loadMarkets();
  }, []);

  // Automatically build category tabs from existing markets
  const categories = [
    "Trending",
    ...Array.from(
      new Set(
        markets
          .map((m: any) => m.category)
          .filter(Boolean)
      )
    ),
  ];

  const filteredMarkets =
    selectedCategory === "Trending"
      ? [...markets].sort(
          (a: any, b: any) =>
            (b.totalvolume || 0) -
            (a.totalvolume || 0)
        )
      : markets.filter(
          (market: any) =>
            market.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-5xl font-black mb-3">
          All Markets
        </h1>

        <p className="text-zinc-500 mb-8">
          Browse every available market.
        </p>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`
                px-4
                py-2
                rounded-xl
                border
                transition-all
                duration-200
                ${
                  selectedCategory === category
                    ? `
                      bg-emerald-500
                      text-black
                      border-emerald-500
                      font-bold
                    `
                    : `
                      bg-zinc-950
                      border-white/10
                      text-zinc-400
                      hover:text-white
                      hover:border-emerald-500/40
                    `
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* MARKET COUNT */}
        <div className="mb-8 text-zinc-500 text-sm">
          Showing {filteredMarkets.length} markets
          {selectedCategory !== "Trending" &&
            ` in ${selectedCategory}`}
        </div>

        {/* MARKETS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

          {filteredMarkets.map((market: any) => (
            <div
              key={market.id}
              onClick={() =>
                router.push(`/market/${market.id}`)
              }
              className="
                cursor-pointer
                bg-zinc-950
                border
                border-white/10
                rounded-2xl
                p-5
                hover:border-emerald-500/40
                hover:-translate-y-1
                transition-all
                duration-200
              "
            >
              <div className="flex items-center justify-between mb-3">

                <div className="text-emerald-400 text-sm">
                  {market.category}
                </div>

                {market.is_live && (
                  <div className="
                    px-2
                    py-1
                    rounded-full
                    bg-red-500/15
                    border
                    border-red-500/30
                    text-red-400
                    text-[10px]
                    font-bold
                  ">
                    LIVE
                  </div>
                )}
              </div>

              <h3 className="font-bold text-lg mb-3 line-clamp-2">
                {market.title}
              </h3>

              <p className="text-zinc-500 text-sm line-clamp-3 mb-4">
                {market.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">

                <div>
                  <div className="text-zinc-500 text-xs uppercase">
                    Volume
                  </div>

                  <div className="font-bold">
                    K{market.totalvolume || 0}
                  </div>
                </div>

                <div className="text-zinc-500 text-xs">
                  {new Date(
                    market.end_date
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="
            text-center
            py-20
            text-zinc-500
          ">
            No markets found in this category.
          </div>
        )}

      </div>
    </main>
  );
}