'use client'

import { motion } from 'framer-motion'
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getWallet } from "@/lib/wallet";
import UserPreview from "@/app/profile/UserPreview";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  Activity,
  Clock3,
  Radio,
  Zap,
  DollarSign,
  Users,
  Trophy,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  FaXTwitter,
  FaDiscord,
  FaTelegram,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";

export default function HomePage() {
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [openChart, setOpenChart] = useState<number | null>(null);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [trading, setTrading] = useState<number | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [standaloneMarkets, setStandaloneMarkets] = useState<Market[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [portfolioStats, setPortfolioStats] = useState({
    marketsTraded: 0,
    activePositions: 0,
    totalShares: 0,
    totalPossiblePayout: 0,
  });
  const [chartHistory, setChartHistory] = useState<
    Record<number, any[]>
  >({});
  const [sellModal, setSellModal] = useState<{
    open: boolean;
    marketId: number | null;
  }>({
    open: false,
    marketId: null,
  });
  const [sellOutcome, setSellOutcome] = useState("");
  const [sellShares, setSellShares] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [buyAmounts, setBuyAmounts] = useState<
    Record<number, string>
  >({});

  async function loadPortfolio() {
    try {
      const res = await fetch(
        "https://api.theprobability.site/portfolio",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        setPortfolioStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadListings() {
    try {
      const res = await fetch(
        "https://api.theprobability.site/listings"
      );

      const data = await res.json();

      if (data.success) {
        setListings(data.listings);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function createListing() {
    try{

      const res = await fetch(
        "https://api.theprobability.site/listings/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            marketId: sellModal.marketId,
            outcome: sellOutcome,
            shares: Number(sellShares),
            price: Number(sellPrice),
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed");
        return;
      }

      alert("Listing created");

      setSellModal({
        open: false,
        marketId: null,
      }),

      setSellOutcome("");
      setSellShares("");
      setSellPrice("");
    } catch (err) {
      console.error(err);
    }
  }

  async function loadChart(marketId: number) {
    try {
      const res = await fetch(
        `https://api.theprobability.site/history/${marketId}`
      );

      const data = await res.json();

      if (data.success) {
        setChartHistory(prev =>({
          ...prev,
          [marketId]: data.history,
        }));
      }
    } catch (err){
      console.error(err);
    }
  }

  const [user, setUser] = useState<{
    email: string;
    username: string;
  } | null>(null);
  const [betAmounts, setBetAmounts] = useState<Record<number, string>>({});
  type Market = {
    id: number;
    title: string;
    description: string;
    rules?: string;
    category: string;
    end_date: string;

    options: string[]; 

    pools?: Record<string, number>;
    odds?: Record<string, number>;

    totalvolume: number;
    market_type?: string;

    bundle_predictions?: string[];

    is_live?: boolean;
    live_duration_minutes?: number;
  };
  const [markets, setMarkets] = useState<Market[]>([]);

  async function buyPosition(
    marketId: number,
    side: string
  ) {
    try {
      const amount = Number(betAmounts[marketId]);
      if (!amount || amount <= 0) {
        alert("Enter bet amount");
        return;
      }

      if (trading === marketId) return;
      setTrading(marketId);

      const res = await fetch(
        "https://api.theprobability.site/trades/buy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            marketId,
            outcome: side,
            amount,
          }),
        }
      );

      const text = await res.text();
      console.log("RAW RESPONSE:", text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("Not JSON:", text);
        alert("Backend did not return JSON");
        return;
      }

      if (!data.success) {
        alert(data.error || "Trade failed");
        return;
      }
      alert("Trade placed successfully");
      
      await Promise.all([
        loadWallet(),
        loadMarkets(),
        loadPortfolio(),
      ])
    } catch (err) {
      console.error(err);
      alert("Trade failed");
    } finally {
      setTrading(null);
    }
  }

  async function loadMarkets() {
    try {
      const res = await fetch("https://api.theprobability.site/markets");
      const data = await res.json();
      if (data.success) {
        setMarkets(data.markets);
        setEvents(data.events);
        setStandaloneMarkets(data.standaloneMarkets);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadUser() {
    try {
      const res = await fetch("https://api.theprobability.site/auth/me", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to load user", err);
    }
  }

  async function buyListing(listingId: number, maxShares: number) {
    try {

      const sharesToBuy =
        Number(buyAmounts[listingId]);

      if (
        !sharesToBuy ||
        sharesToBuy <= 0
      ) {
        alert("Enter shares to buy");
        return;
      }

      if (sharesToBuy > maxShares) {
        alert("Not enough shares available");
        return;
      }

      const res = await fetch(
        "https://api.theprobability.site/listings/buy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            listingId,
            sharesToBuy,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Purchase failed");
        return;
      }

      alert("Shares purchased");

      await Promise.all([
        loadWallet(),
        loadPortfolio(),
        loadListings(),
      ]);
    } catch (err) {
      console.error(err);
    }
  }

  async function depositPaystack() {
    try {
      if (!amount || Number(amount) <= 0) {
        alert("Enter a valid amount");
        return;
      }

      if (!phone) {
        alert("Enter phone number");
        return;
      }

      if (!user?.email) {
        alert("User email missing (auth not loaded)");
        return;
      }

      setLoadingDeposit(true);

      const res = await fetch("https://api.theprobability.site/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: Number(amount),
          email: user.email,
        }),
      });

      const data = await res.json();
      console.log("Paystack response:", data);

      if (!data.success) {
        alert(data.message || "Payment initialization failed");
        return;
      }

      window.location.href = data.data.authorization_url;
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoadingDeposit(false);
    }
  }

  const [wallet, setWallet] = useState<{
    balance: number;
  } | null>(null);

  async function loadWallet() {
    const data = await getWallet();
    if (data.success) {
      setWallet(data.wallet);
    }
  }

  useEffect(() => {
    loadUser();
    loadWallet();
    loadMarkets();
    loadPortfolio();
    loadListings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadMarkets();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const featuredMarkets = markets.filter(
    (m: any) => m.featured
  );

  const liveMarkets = markets.filter(
    (m: any) => m.is_live
  );

  const normalMarkets = markets.filter(
    (m: any) => !m.is_live
  );

  const TRENDING_LIMIT = 32;

  const homepageItems = [
  ...events,
  ...normalMarkets,
  ].slice(0, TRENDING_LIMIT);

  type Event = {
  id: number;
  title: string;
  description: string;
  category: string;

  featured?: boolean;
  end_date?: string;
  totalvolume?: number;

  is_live?: boolean;
  market_type?: string;

  markets: {
    id: number;
    title: string;
    odds?: number;
    volume?: number;
  }[];
  };

  const liveScrollRef = useRef<HTMLDivElement | null>(null);

  function scrollLiveMarkets(direction: "left" | "right") {
    if (!liveScrollRef.current) return;

    liveScrollRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  }

  const [showProfileHint, setShowProfileHint] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seen-profile-menu");

    if (!seen) {
      setShowProfileHint(true);

      const timer = setTimeout(() => {
        setShowProfileHint(false);
        localStorage.setItem("seen-profile-menu", "true");
      }, 7000);

      return () => clearTimeout(timer);

    }
  }, []);

  const [showMarketHint, setShowMarketHint] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seen-market-hint");

    if (!seen) {
      setShowMarketHint(true);

      const timer = setTimeout(() => {
        setShowMarketHint(false);
        localStorage.setItem("seen-market-hint", "true");
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, []);
  useEffect(() => {
    if (featuredMarkets.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) =>
        prev >= featuredMarkets.length - 1
          ? 0
          : prev + 1
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [featuredMarkets.length]);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* FEATURED MARKET SLIDESHOW */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,150,0.12),transparent_55%)]" />

        <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">

          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-emerald-400 text-sm font-semibold uppercase tracking-[0.2em]">
                Featured Markets
              </div>

              <h1 className="text-4xl md:text-5xl font-black mt-2">
                Trade live probabilities
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-2 text-zinc-500 text-sm">
              <Activity size={16} />
              Real-time market sentiment
            </div>

            {user ? (
              <div className="relative group">

                {showProfileHint && (
                  <div
                    className="
                      absolute
                      top-full
                      right-0
                      mb-3
                      w-64
                      rounded-xl
                      bg-zinc-950
                      border border-emerald-500/30
                      shadow-xl
                      shadow-emerald-500/10
                      px-4
                      py-3
                      animate-bounce
                      z-100
                    "
                  >
                    <p className="text-sm text-white font-medium">
                      👋 Click here to access your profile, settings,
                      creator dashboard and more.
                    </p>

                    <div
                      className="
                        absolute
                        -top-4
                        right-6
                        border-8
                        border-transparent
                        border-t-zinc-950
                      "
                    />
                  </div>
                )}

                <button
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="
                    flex items-center gap-3
                    bg-zinc-900
                    hover:bg-zinc-800
                    px-4 py-2
                    rounded-xl
                    border border-white/10
                    transition
                  "
                >

                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>

                  <span>@{user.username}</span>
                </button>

                <div
                  className={`
                    absolute
                    right-0
                    top-full
                    mt-2
                    w-64
                    bg-zinc-950
                    border
                    border-white/10
                    rounded-2xl
                    transition-all
                    z-50
                    overflow-hidden
                    ${
                      profileMenuOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                     }
                  `}
                >

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push(`/profile/${user.username}`);
                    }}
                    className="
                      w-full
                      text-left
                      p-4
                      hover:bg-white/5
                    "
                  >

                    <div className="font-bold">
                      @{user.username}
                    </div>

                    <div className="text-zinc-500 text-sm">
                      View Profile
                    </div>
                  </button>

                  <div className="border-t border-white/10" />

                  <button
                    onClick={() => { setProfileMenuOpen(false); router.push("/settings");}}
                    className="
                      w-full
                      text-left
                      p-4
                      hover:bg-white/5
                    "
                  >

                    Settings
                  </button>

                  <button
                    onClick={() => { setProfileMenuOpen(false); router.push("/how-it-works"); }}
                    className="
                      w-full
                      text-left
                      p-4
                      hover:bg-white/5
                    "
                  >
                    How It Works
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/news");
                    }}
                    className="
                      w-full
                      text-left
                      p-4
                      hover:bg-white/5
                    "
                  >
                    News & Analysis
                  </button>

                  <button
                    onClick={() =>{
                      setProfileMenuOpen(false);
                      router.push("/create-your-own-market");
                    }}
                    className="
                      w-full
                      text-left
                      p-4
                      hover:bg-white/5
                    "
                  >
                    Create Your Own Market
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/creator-dashboard");
                    }}
                    className="
                      w-full
                      text-left
                      p-4
                      hover:bg-white/5
                    "
                  >
                    Creator Dashboard
                  </button>

                  <button
                    onClick={() => { setProfileMenuOpen(false); router.push("/help");}}
                    className="
                      w-full
                      text-left
                      p-4
                      hover:bg-white/5
                      "
                    >
                      Help Center
                  </button>

                  <button
                    onClick={() => { setProfileMenuOpen(false); router.push("/terms");}}
                    className="
                      w-full
                      text-left
                      p-4
                      hover:bg-white/5
                    "
                  >
                    Terms & Conditions
                  </button>

                  <button
                    onClick={async () => {
                      await fetch(
                        "https://api.theprobability.site/auth/logout",
                        {
                          method: "POST",
                          credentials: "include",
                        }
                      );
                      setProfileMenuOpen(false);

                      router.push("/login");
                    }}
                    className="
                      w-full
                      text-left
                      p-4
                      hover:bg-white/5
                      text-red-500
                    "
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (

                <button
                  onClick={() => router.push("/register")}
                  className="
                    px-5
                    py-2
                    rounded-xl
                    border
                    border-white/10
                    bg-zinc-900
                    hover:bg-zinc-800
                    transition
                  "
                >
                  Sign In
                </button>
            )}
          </div>

          <div className="relative h-[420px] md:h-[460px]">

            {featuredMarkets.map((market, index) => {

              const isActive = index === activeSlide;

              return (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.96,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className={`
                    absolute
                    inset-0
                    rounded-3xl
                    border
                    border-white/10
                    bg-gradient-to-br
                    from-zinc-900
                    to-black
                    p-6
                    flex
                    flex-col
                    justify-between
                    overflow-hidden
                    ${
                      isActive
                        ? "pointer-events-auto z-20"
                        : "pointer-events-none z-0"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,150,0.12),transparent_40%)]" />

                    <div className="relative z-10">

                      <div className="flex items-center justify-between mb-6">

                        <div className="flex items-center gap-2">

                          <div className="
                            px-3
                            py-1
                            rounded-full
                            bg-emerald-500/10
                            border
                            border-emerald-500/20
                            text-emerald-300
                            text-xs
                            font-semibold
                          ">
                            {market.category}
                          </div>

                          {market.market_type === "bundle" && (
                            <div className="
                              px-3
                              py-1
                              rounded-full
                              bg-purple-500/10
                              border
                              border-purple-500/20
                              text-purple-300
                              text-xs
                              font-semibold
                            ">
                              Bundle
                            </div>
                          )}
                        </div>

                        <div className="text-zinc-500 text-sm flex items-center gap-1">
                          <Clock3 size={14} />
                          {new Date(market.end_date).toLocaleDateString()}
                        </div>
                      </div>

                      <h2 className="
                        text-2xl
                        md:text-5xl
                        font-black
                        leading-tight
                        max-w-4xl
                      ">
                        {market.title}
                      </h2>

                      <p className="
                        mt-4
                        text-zinc-400
                        text-sm
                        md:text-lg
                        leading-relaxed
                        max-w-3xl
                      ">
                        {market.description}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-8">

                        {market.options?.slice(0, 3).map((option: string) => (
                          <div
                            key={option}
                            className="
                              bg-black/40
                              border
                              border-white/10
                              rounded-2xl
                              px-4
                              py-3
                              min-w-[120px]
                            "
                          >
                            <div className="text-zinc-500 text-xs mb-1">
                              {option}
                            </div>

                            <div className="text-xl font-black text-emerald-400">
                              {((market.odds?.[option] ?? 0) * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="
                      relative
                      z-10
                      mt-8
                      flex
                      items-center
                      justify-between
                    ">
                      <div>
                        <div className="text-zinc-500 text-xs uppercase">
                          Volume
                        </div>

                        <div className="text-2xl font-black">
                          KES{market.totalvolume}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          document
                            .getElementById(`market-${market.id}`)
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            })
                        }
                        className="
                          bg-emerald-500
                          hover:bg-emerald-400
                          transition
                          text-black
                          font-bold
                          px-6
                          py-3
                          rounded-2xl
                          flex
                          items-center
                          gap-2
                        "
                      >
                        Trade Market
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </motion.div>
              );
            })}

            {/* DOTS */}
            <div className="
              absolute
              bottom-4
              left-1/2
              -translate-x-1/2
              flex
              gap-2
              z-30
            ">
              {featuredMarkets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`
                    w-3
                    h-3
                    rounded-full
                    transition
                    ${
                      activeSlide === index
                        ? "bg-emerald-400"
                        : "bg-white/20"
                    }`}
                  />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE MARKETS ROW */}
      <section className="border-b border-white/10 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 py-10">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-3xl font-black flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                Live Markets
              </h2>

              <p className="text-zinc-500 mt-2">
                Real-time continuously resolving prediction markets.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollLiveMarkets("left")}
                className="
                  w-12
                  h-12
                  rounded-2xl
                  border
                  border-white/10
                  hover:border-red-500/40
                  hover:bg-red-500/10
                  transition
                  flex
                  items-center
                  justify-center
                "
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => scrollLiveMarkets("right")}
                className="
                  w-12
                  h-12
                  rounded-2xl
                  border
                  border-white/10
                  hover:border-red-500/40
                  hover:bg-red-500/10
                  transition
                  flex
                  items-center
                  justify-center
                "
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={liveScrollRef}
            className="
              flex
              gap-5
              overflow-x-hidden
              scroll-smooth
            "
          >
            {liveMarkets.map((market) => (
              <motion.div
                key={market.id}
                whileHover={{ y: -4 }}
                className="
                  min-w-[340px]
                  max-w-[340px]
                  rounded-3xl
                  border
                  border-red-500/30
                  bg-gradient-to-br
                  from-red-950/40
                  via-black
                  to-zinc-950
                  p-5
                  relative
                  overflow-hidden
                  shrink-0
                "
              >
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                  className="
                    absolute
                    top-0
                    left-0
                    w-1/2
                    h-[2px]
                    bg-gradient-to-r
                    from-transparent
                    via-red-400
                    to-transparent
                  "
                />

                <div className="flex items-center justify-between mb-4">

                  <div className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-1
                    rounded-full
                    bg-red-500/15
                    border
                    border-red-500/30
                    text-red-400
                    text-xs
                    font-bold
                  ">
                    <Radio size={12} />
                    LIVE
                  </div>

                  <div className="text-xs text-zinc-500">
                    {new Date(market.end_date).toLocaleTimeString()}
                  </div>
                </div>

                <h3 className="text-xl font-black leading-tight mb-3">
                  {market.title}
                </h3>

                <p className="text-sm text-zinc-500 line-clamp-3 mb-5">
                  {market.description}
                </p>

                <div className="space-y-2 mb-5">
                  {market.options?.slice(0, 2).map((option) => (
                    <div
                      key={option}
                      className="
                        flex
                        items-center
                        justify-between
                        bg-black/40
                        border
                        border-white/10
                        rounded-xl
                        px-4
                        py-3
                      "
                    >
                      <div className="text-sm text-white">
                        {option}
                      </div>

                      <div className="text-lg font-black text-red-400">
                        {((market.odds?.[option] ?? 0) * 100).toFixed(0)}¢
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push(`/market/${market.id}`)}
                  className="
                    w-full
                    bg-red-500
                    hover:bg-red-400
                    transition
                    text-black
                    font-bold
                    py-3
                    rounded-2xl
                  "
                >
                  Open Live Market
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-white/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={<DollarSign />}
            title="Daily Volume"
            value="$4.2M"
          />

          <StatCard
            icon={<Users />}
            title="Active Traders"
            value="82,000"
          />

          <StatCard
            icon={<Activity />}
            title="Live Markets"
            value="1,240"
          />

          <StatCard
            icon={<Trophy />}
            title="Paid Out"
            value="$91M"
          />
        </div>
      </section>

      {/* TRENDING MARKETS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold">Trending Markets</h2>
            <p className="text-zinc-500 mt-2">
              Real-time probabilities from the crowd.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                alert("Please login to view all markets");
                router.push("/login");
                return;
              }
              router.push("/markets");
            }}
            className="
              border
              border-white/10
              hover:border-white/30
              px-5
              py-3
              rounded-xl
              transition
              flex
              items-center
              gap-2
            "
          >
            View All
            <ArrowUpRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
          {homepageItems.map((item, index) => {

          const isEvent = "markets" in item;

          const visibleOptions = isEvent
            ? item.markets.slice(0, 2)
            : item.options?.slice(0, 2) || [];

          return (
            <motion.div
              id={`market-${item.id}`}
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`
                group
                rounded-2xl
                relative
                border
                overflow-hidden
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-2xl
                h-[300px]
                flex
                flex-col
                ${
                  item.is_live
                    ?`
                    bg-gradient-to-br
                    from-red-950/40
                    via-black
                    to-zinc-950
                    border-red-500/40
                    hover:border-red-400
                    shadow-[0_0_35px_rgba(255,0,80,0.15)]`
                    : item.market_type === "bundle" ?
                    `
                    bg-gradient-to-br
                    from-purple-950/40
                    to-zinc-950
                    border-purple-500/20
                    hover:border-purple-400/50
                    `
                    :
                    `
                    bg-zinc-950
                    border-white/10
                    hover:border-emerald-500/30
                    `
                }`}
            >
              <div className="p-4 flex-1 flex flex-col relative">
                {item.is_live && (
                  <motion.div
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="
                      absolute
                      top-0
                      left-0
                      w-1/2
                      h-[2px]
                      bg-gradient-to-r
                      from-transparent
                      via-red-400
                      to-transparent
                    "
                  />
                )}

              <div className="flex items-start justify-between gap-2 mb-3">

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="text-[11px] uppercase tracking-wider text-emerald-400">
                    {item.category}
                  </div>

                  {item.is_live && (
                    <div className="
                      flex
                      items-center
                      gap-1
                      px-2
                      py-1
                      rounded-full
                      bg-red-500/15
                      border
                      border-red-500/30
                      text-red-400
                      text-[11px]
                      font-bold
                      animate-pulse
                    ">
                      <Radio size={10} />
                      LIVE
                    </div>
                  )}
                </div>

                  <div className="relative inline-block">

                    {index === 0 && showMarketHint && (
                      <div
                        className="
                          absolute
                          top-full
                          left-0
                          mt-3
                          w-72
                          rounded-xl
                          bg-zinc-950
                          border border-emerald-500/30
                          shadow-xl
                          shadow-emerald-500/10
                          px-4
                          py-3
                          animate-bounce
                          z-50
                        "
                      >
                        <p className="text-sm font-medium text-white">
                          👆 Click the market title to view the full market,
                          see all outcomes, charts, discussions, and start trading.
                          Please apply this logic to any and all existing markets throughout the platform.
                        </p>

                        <div
                          className="
                            absolute
                            bottom-full
                            left-6
                            border-8
                            border-transparent
                            border-b-zinc-950
                          "
                        />
                        </div>
                      )}
                      <h3
                        onClick={() => router.push(isEvent ? `/event/${item.id}` : `/market/${item.id}`)}
                        className="
                          text-[14px]
                          font-semibold
                          leading-4
                          text-white
                          cursor-pointer
                          hover:text-emerald-400
                          transition
                        "
                      >
                        {item.title}
                      </h3>
                      </div>
                </div>

                <div className="flex text-[11px] text-zinc-500 items-center gap-1 whitespace-nowrap">
                  <Clock3 size={11} />
                  {item.end_date
  ? new Date(item.end_date).toLocaleDateString()
  : "Multiple markets"}
                </div>
              </div>

                <p className="text-[9px] leading-3 line-clamp-2 text-zinc-500 mb-3">
                  {item.description}
                </p>

                {item.is_live && (
                  <div className="
                    flex
                    items-center
                    gap-2
                    mt-3
                    mb-4
                    text-red-400
                    text-xs
                    font-semibold
                  ">
                    <Zap size={14} />
                    
                    Resolves:
                    {" "}
                    {item.end_date
  ? new Date(item.end_date).toLocaleTimeString()
  : "--"}
                  </div>
                )}

                {/* BUNDLE PREDICTIONS */}
                {item.market_type === "bundle" &&
                  item.bundle_predictions &&
                  item.bundle_predictions.length > 0 && (

                    <div className="mb-2">

                      <div className="text-xs font-bold text-emerald-400 mb-1">
                        Prediction Package
                      </div>

                      <div className="space-y-1 max-h-16 overflow-y-auto pr-1">

                        {item.bundle_predictions.map(
                          (prediction: string, i: number) => (

                            <div
                            key={i}
                            className="
                              bg-black/30
                              border
                              border-white/5
                              rounded-lg
                              px-2
                              py-1.5
                              text-[11px]
                              text-zinc-400
                            "
                          >
                            #{i + 1}
                            {" "}
                            {prediction}
                          </div>
                          )
                        )}
                      </div>

                    </div>
                  )}

                <input
                  value={betAmounts[item.id] || ""}
                  onChange={(e) => 
                    setBetAmounts(prev => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  placeholder="Bet amount"
                  className="w-full mb-4 bg-zinc-900 text-white px-2 py-1.5 rounded border border-white/10 outline-none focus:border-emerald-500"
                />

                <div className="grid grid-cols-2 gap-3 ">
                  {item.market_type === "bundle" ? (
                    <>
                      <button
                        onClick={() =>
                          buyPosition(item.id, "YES")
                        }
                        disabled={trading === item.id}
                        className="
                          h-10
                          min-w-0
                          rounded-lg
                          border
                          border-purple-500/20
                          bg-purple-500/15
                          hover:bg-purple-500/25
                          hover:border-purple-400/50
                          transition-all
                          px-2
                          overflow-hidden
                        "
                      >
                        <div className="flex items-center justify-between gap-1 w-full min-w-0">
                          <span className="
                            text-[9px]
                            font-medium
                            text-white
                            truncate
                            flex-1
                            text-left
                          ">
                            Package YES
                          </span>

                          <span className="
                            text-[11px]
                            font-bold
                            text-purple-300
                            shrink-0
                          ">
                            WIN
                          </span>
                        </div>
                        
                      </button>

                      <button
                        onClick={() =>
                          buyPosition(item.id, "NO")
                        }
                        disabled={trading === item.id}
                        className="
                          h-10
                          min-w-0
                          rounded-lg
                          border
                          border-red-500/20
                          bg-red-500/10
                          hover:bg-red-500/20
                          hover:border-red-400/40
                          transition-all
                          px-2
                          overflow-hidden
                        "
                      >
                        <div className="flex items-center justify-between gap-1 w-full min-w-0">

                          <span className="
                            text-[9px]
                            font-medium
                            text-red-200
                            truncate
                            flex-1
                            text-left
                          ">
                            Package NO
                          </span>

                          <span className="
                            text-[11px]
                            font-bold
                            text-red-300
                            shrink-0
                          ">
                            FAIL
                          </span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                    {isEvent
                      ? visibleOptions.map((market: Event["markets"][number]) => (
                      <button
                        key={market.id}
                        onClick={() => router.push(`/market/${market.id}`)}
                        className="
                          h-9
                          min-w-0
                          rounded-lg
                          border
                          border-white/10
                          bg-black/30
                          hover:bg-emerald-500/10
                          hover:border-emerald-500/40
                          transition-all
                          px-2
                          overflow-hidden
                        "
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate text-[11px]">
                            {market.title}
                          </span>
                          <span className="font-bold text-emerald-400">
                            {market.odds != null
                                ? `${Math.round(market.odds * 100)}¢`
                                : "--"}
                          </span>
                        </div>
                      </button>
                    ))
                    
                    : visibleOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => buyPosition(item.id, option)}
                        disabled={trading === item.id}
                        className="
                          h-9
                          min-w-0
                          rounded-lg
                          border
                          border-white/10
                          bg-black/30
                          hover:bg-emerald-500/10
                          hover:border-emerald-500/40
                          transition-all
                          px-2
                          overflow-hidden
                        "
                      >
                        <div className="flex items-center justify-between gap-1 w-full min-w-0">
                          <span
                            className="
                              text-[11px]
                              font-medium
                              text-white
                              truncate
                              min-w-0
                              flex-1
                              text-left
                            "
                          >
                            {option}
                          </span>
                          <span
                            className="
                              text-[11px]
                              font-bold
                              text-emerald-400
                              shrink-0
                            "
                          >
                            {((item.odds?.[option] ?? 0) * 100).toFixed(0)}¢
                          </span>
                        </div>
                      </button>
                    ))}

                    {(isEvent
                      ? item.markets.length > 2
                      : item.options.length > 2) && (
                        <button
                          onClick={() => router.push(isEvent ? `/event/${item.id}` : `/market/${item.id}`)}
                          className="
                            mt-2
                            w-full
                            text-[11px]
                            text-zinc-400
                            hover:text-emerald-400
                            transition
                          "
                        >
                          +{isEvent
    ? item.markets.length - 2
    : item.options.length - 2}
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                  
                  <div>
                    <div className="text-[9px] uppercase text-zinc-500">
                      Volume
                    </div>

                    <div className="text-xs font-bold">
                      KES{item.totalvolume ?? 0}
                    </div>
                  </div>
                </div>
            </div>
          </motion.div>
          );
          })}
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="border-t border-white/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-10">
            <h2 className="text-4xl font-bold">Portfolio Dashboard</h2>
            <p className="text-zinc-500 mt-2">
              Track your positions and profits in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-black border border-white/10 rounded-3xl p-6">
              <div className="text-zinc-500 text-sm">Wallet Balance</div>
              <div className="mt-4 flex flex-wrap items-end gap-2">
                <span className="text-2xl font-black text-emerald-400">
                  KES
                </span>

                <span
                  className="
                    font-black
                    leading-none
                    break-all
                    text-[clamp(1rem,4vw,3rem)]
                  "
                >
                  {Number(wallet?.balance ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="text-emerald-400 mt-3 text-lg">
                Available for trading
              </div>
            </div>

            <div className="bg-black border border-white/10 rounded-3xl p-6">
              <div className="text-zinc-500 text-sm">
                Prediction Accuracy
              </div>
              <div className="text-5xl font-black mt-4">74%</div>
              <div className="text-zinc-400 mt-3 text-lg">
                Top 3% globally
              </div>
            </div>

            <div className="bg-black border border-white/10 rounded-3xl p-6">
              <div className="text-zinc-500 text-sm mb-4">Deposit via M-pesa</div>
              
              <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone"
              className="w-full mb-3 bg-zinc-900 text-white px-3 py-2 rounded outline-none border border-white/10 focus:border-emerald-500"
              />

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full mb-3 bg-zinc-900 text-white px-3 py-2 rounded outline-none border border-white/10 focus:border-emerald-500"
              />

              <button
                onClick={depositPaystack}
                disabled={loadingDeposit}
                className="bg-green-500 hover:bg-green-400 disabled:opacity-50 transition px-4 py-2 rounded w-full"
              >
                {loadingDeposit ? "Redirecting..." : "Pay with M-pesa"}
              </button>
            </div>

            <div className="bg-black border border-white/10 rounded-3xl p-6">
              <div className="text-zinc-500 text-sm">Markets Traded</div>
              <div className="text-5xl font-black mt-4">{portfolioStats.marketsTraded}</div>
              <div className="text-zinc-400 mt-3 text-lg">
                {portfolioStats.activePositions} active positions
              </div>
              <div className="text-emerald-400 mt-2 text-sm">
                {portfolioStats.totalShares} total shares owned
              </div>
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="text-zinc-500 text-sm">
                  Total Possible Payout
                </div>
                <div className="font-black text-emerald-400 leading-none break-all text-[clamp(1rem,5vw,1.875rem)] mt-2">
                  KES
                  {Number(portfolioStats.totalPossiblePayout || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {sellModal.open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 w-full max-w-md">

            <h2 className="text-2xl font-bold mb-6">
              Create Share Listing
            </h2>

            <select
              value={sellOutcome}
              onChange={(e) => setSellOutcome(e.target.value)}
              className="w-full mb-4 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3"
            >
              <option value="">Select outcome</option>

              {markets
                .find(m => m.id === sellModal.marketId)
                ?.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
              ))}
            </select>

            <input
              value={sellShares}
              onChange={(e) => setSellShares(e.target.value)}
              placeholder="Shares to sell"
              className="w-full mb-4 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3"
            />

            <input
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="Sale price"
              className="w-full mb-6 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3"
            />

            <div className="flex gap-3">
              <button
                onClick={createListing}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 transition rounded-xl py-3 font-bold text-black"
              >
                Create Listing
              </button>

              <button
                onClick={() =>
                  setSellModal({
                    open: false,
                    marketId: null,
                  })
                }
                className="flex-1 border border-white/10 rounded-xl py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-black text-emerald-400">
              Probability
            </div>

            <div className="text-zinc-500 text-sm mt-2">
              The global prediction marketplace.
            </div>
          </div>

          {/* SOCIALS */}
          <div className="flex items-center gap-5 text-2xl">

            <a
              href="https://x.com/mollyja47470434"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition"
            >
              <FaXTwitter />
            </a>

            <a
              href="https://discord.gg/YOUR_SERVER"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-indigo-400 transition"
            >
              <FaDiscord />
            </a>

            <a
              href="https://t.me/UntitledInc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-sky-400 transition"
            >
              <FaTelegram />
            </a>

            <a
              href="https://www.youtube.com/@untitled-p1e"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-red-500 transition"
            >
              <FaYoutube />
            </a>

            <a
              href="https://www.instagram.com/ineedanewusername_anyideas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-pink-500 transition"
            >
              <FaInstagram />
            </a>
          </div>

          <div className="text-zinc-500 text-sm">
            © 2026 Probability. All rights reserved.
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-10 pt-8 border-t border-white/5">

          <p
            className="
              text-[11px]
              leading-5
              text-zinc-600
              max-w-6xl
            "
          >
            Probability operates globally through separate legal entities.
            Probability KE is operated by Untitled LLC. Trading on Probability
            involves risk and may not be appropriate for all users.
            Members risk losing their cost to enter any transaction,
            including fees. You should carefully consider whether trading
            on Probability is appropriate for you in light of your
            investment experience, objectives, and/or financial resources.
            Any trading decisions you make are solely your responsibility
            and at your own risk. Information is provided for convenience
            only on an "AS IS" basis without warranties of any kind.
            Past performance is not necessarily indicative of future
            results.
          </p>
        </div>
      </div>
      </footer>
    </main>
  )
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="bg-black border border-white/10 rounded-2xl p-6">
      <div className="text-emerald-400 mb-4">{icon}</div>
      <div className="text-zinc-500 text-sm">{title}</div>
      <div className="text-3xl font-black mt-2">{value}</div>
    </div>
  )
}
