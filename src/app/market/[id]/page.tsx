'use client'

import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useParams, useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import UserPreview from "@/app/profile/UserPreview";

export default function MarketPage() {
  const params = useParams();
  const marketId = params.id;
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false); // Fix for Recharts SSR dimension bug
  const [market, setMarket] = useState<any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [betAmount, setBetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [activeReply, setActiveReply] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [rulesTab, setRulesTab] = useState<"rules" | "predictions" | "positions">("rules");
  const [myPositions, setMyPositions] = useState<any[]>([]);
  const [sharesToSell, setSharesToSell] = useState<Record<number, string>>({});
  const [replies, setReplies] = useState<Record<number, any[]>>({});
  const [postingComment, setPostingComment] = useState(false);
  const [activeTab, setActiveTab] = useState<"comments" | "holders" | "activity">("comments");
  const [topHolders, setTopHolders] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [isMobile, setIsMobile] =useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };

    check();

    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);
  
  async function loadTopHolders() {
    try {
      const res = await fetch(`https://api.theprobability.site/markets/${marketId}/holders`);
      const data = await res.json();
      if (data.success) {
        setTopHolders(
          data.holders.filter(
            (holder: any) =>
              holder.username.toLowerCase() !== "admin"
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  const fakeUsers = [
  "Vincent",
  "teddy_boii",
  "bakhresa",
  "Elonmuskfan",
  "sichoki",
  "irreplaceable_aaron",
  "icandowhateverthefuckiwant",
  "kamdoli",
  "001Burenda",
  "mluo_arrogant",
  "officialbrian",
  "ADRIANNA",
  "RICH_TILL_I_DIE",
  "QueenVee",
  "diana",
  "bodega_bitch",
  "shannel_coco",
  "nikitakudos",
  "RichAuntie",
  "AliceTripoli",
  "bechicksnamedSandy",
  "KAREN",
  "freakyNikki",
  "NoUsername1",
  "pretty_badbitch",
  "daisie",
  "appleworshipsLucifer",
  "MrMoney",
  "MoreMoneyMoreProblems",
  ];

  const fakeActions = [
  "bought",
  "sold",
  ];

  const [displayActivity, setDisplayActivity] = useState<any[]>([]);

  useEffect(() => {
  setDisplayActivity(activity);
  }, [activity]);

  useEffect(() => {
  if (!market) return;

  const interval = setInterval(() => {

    const user =
      fakeUsers[Math.floor(Math.random() * fakeUsers.length)];

    const action =
      fakeActions[Math.floor(Math.random() * fakeActions.length)];

    const outcome =
      market.options[
        Math.floor(Math.random() * market.options.length)
      ];

    const shares =
      (Math.random() * 75 + 5).toFixed(2);

    const price =
      (
        (market.odds?.[outcome] ?? 0.5) * 100 +
        (Math.random() * 8 - 4)
      ).toFixed(0);

    const fakeTrade = {
      id: Date.now(),
      username: user,
      shares,
      outcome,
      price,
      action,
      fake: true,
      created_at: new Date().toISOString(),
    };

    setDisplayActivity(prev => [
      fakeTrade,
      ...prev,
    ].slice(0, 20));

  }, 6000 + Math.random() * 8000);

  return () => clearInterval(interval);

  }, [market]);

  async function loadMyPositions() {

    try {

      const res = await fetch(
        `https://api.theprobability.site/markets/${marketId}/my-positions`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        setMyPositions(data.positions);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadActivity() {
    try {
      const res = await fetch(`https://api.theprobability.site/markets/${marketId}/activity`);
      const data = await res.json();
      if (data.success) setActivity(data.activity);
    } catch (err) {
      console.error(err);
    }
  }

  async function likeComment(commentId: number) {
    try {
      const res = await fetch(`https://api.theprobability.site/markets/comments/${commentId}/like`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) return;

      await loadComments();
    } catch (err) {
      console.error(err);
    }
  }

  async function loadReplies(commentId: number) {
    try {
      const res = await fetch(`https://api.theprobability.site/markets/comments/${commentId}/replies`);
      const data = await res.json();
      if (data.success) {
        setReplies(prev => ({ ...prev, [commentId]: data.replies }));
      } 
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteComment(commentId: number) {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`https://api.theprobability.site/markets/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed");
        return;
      }
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteReply(commentId: number, replyId: number) {
    if (!confirm("Delete this reply?")) return;
    try {
      const res = await fetch(`https://api.theprobability.site/markets/replies/${replyId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed");
        return;
      }
      setReplies(prev => ({
        ...prev,
        [commentId]: prev[commentId]?.filter(r => r.id !== replyId) || [],
      }));
    } catch (err) {
      console.error(err);
    }
  }

  async function submitReply(commentId: number) {
    try {
      const content = replyTexts[commentId];
      if (!content?.trim()) return;

      const res = await fetch(`https://api.theprobability.site/markets/comments/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Failed to reply");
        return;
      }

      setReplyTexts(prev => ({ ...prev, [commentId]: "" }));
      await loadReplies(commentId);
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleReply(commentId: number) {
    if (activeReply === commentId) {
      setActiveReply(null);
      return;
    }
    setActiveReply(commentId);
    await loadReplies(commentId);
  }

  function onEmojiClick(emojiData: any) {
    setNewComment((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }

  async function loadComments() {
    try {
      const res = await fetch(`https://api.theprobability.site/markets/${marketId}/comments`);
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch (err) {
      console.error(err);
    }
  }

  async function postComment() {
    try {
      if (!newComment.trim()) return;
      setPostingComment(true);

      const res = await fetch(`https://api.theprobability.site/markets/${marketId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newComment }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to post comment");
        return;
      }

      setNewComment("");
      setShowEmojiPicker(false);
      await loadComments();
    } catch (err) {
      console.error(err);
    } finally {
      setPostingComment(false);
    }
  }

  async function loadMarket() {
    try {
      const res = await fetch(`https://api.theprobability.site/markets/${marketId}`);
      const data = await res.json();
      if (data.success) setMarket(data.market);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadHistory() {
    try {
      const res = await fetch(`https://api.theprobability.site/history/${marketId}`);
      const data = await res.json();
      if (data.success) setHistory(data.history);
    } catch (err) {
      console.error(err);
    }
  }

  async function buyPosition(outcome: string) {
    try {
      setLoading(true);
      const res = await fetch("https://api.theprobability.site/trades/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          marketId,
          outcome,
          amount: Number(betAmount),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Trade failed");
        return;
      }

      alert("Trade successful");
      await loadMarket();
      await loadHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function panicCashout(
    positionId: number,
    sharesToSell: number
  ) {

    try {

      const res = await fetch(
        "https://api.theprobability.site/markets/cashout",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            positionId,
            sharesToSell,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(
          data.error ||
          "Cashout failed"
        );
        return;
      }

      alert(
        `You received K${data.payout}`
      );

      await loadMarket();
      await loadMyPositions();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setIsMounted(true); // Ensures Recharts runs safely on client side
    loadMarket();
    loadHistory();
    loadComments();
    loadMyPositions();
  }, []);

  if (!market) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading market...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-5 md:py-10">
        <div className="mb-8">
          <div className="text-emerald-400 text-sm uppercase mb-3">
            {market.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">{market.title}</h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-4xl">{market.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CHART */}
          <div className="lg:col-span-2 bg-zinc-950 border border-white/10 rounded-3xl p-6">
            <div className="text-2xl font-bold mb-6">Live Probability Chart</div>
            <div className="h-[500px]">
              {/* Mounted safety guard avoids ResponsiveContainer component crashing */}
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}
                    margin={
                      isMobile
                        ? {
                          top: 5,
                          right: 0,
                          left: 0,
                          bottom: 0,
                        } : {
                          top: 20,
                          right: 20,
                          left: 20,
                          bottom: 20,
                        }
                    }
                    >
                    <XAxis dataKey="time" stroke="#666" tick={{ fontSize: isMobile ? 10 : 12, }} minTickGap={isMobile ? 40 : 10} tickLine={false} axisLine={false} padding={{ left: 0, right: 0, }} />
                    {!isMobile && (
                    <YAxis domain={[0, 100]} stroke="#666" />
                    )}
                    <Tooltip />
                    {market.options?.map((option: string, index: number) => {
                      const colors = ["#00ff99", "#00bbff", "#ffcc00", "#ff4477"];
                      return (
                        <Line
                          key={option}
                          type="monotone"
                          dataKey={option}
                          stroke={colors[index % colors.length]}
                          strokeWidth={3}
                          dot={false}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* TRADING PANEL */}
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6">
            <div className="text-2xl font-bold mb-6">Trade Market</div>
            <input
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-black border border-white/10 rounded-2xl px-4 py-4 mb-6"
            />

            <div className="space-y-3">
              {market.options?.map((option: string) => (
                <button
                  key={option}
                  onClick={() => buyPosition(option)}
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 transition rounded-2xl py-4 font-bold text-black flex items-center justify-between px-5"
                >
                  <span>{option}</span>
                  <span>{((market.odds?.[option] ?? 0) * 100).toFixed(0)}¢</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => router.push(`/market/${market.id}/chat`)}
              className="
                w-full
                mt-5
                bg-blue-500
                hover:bg-blue-400
                transition
                rounded-2xl
                py-4
                font-bold
                text-white
              "
            >
              💬 Enter Chat
            </button>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-zinc-500 text-sm">Total Volume</div>
              <div className="mt-2">
                <div className="text-lg font-bold text-zinc-400">
                  KES
                </div>

                <div
                  className="
                    font-black
                    leading-none
                    break-all
                    text-[clamp(1rem,5vw,2.25rem)]
                  "
                >
                  {Number(market.totalvolume ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* COMMENTS + RULES CONTAINER */}
          <div className="lg:col-span-3 mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* FEED TABS */}
              <div className="lg:col-span-2">
                <div className="relative bg-zinc-950 border border-white/10 rounded-2xl overflow-visible focus-within:border-emerald-500 transition">
                  <div className="flex items-center gap-8 px-5 py-4 border-b border-white/10">
                    <button
                      onClick={() => setActiveTab("comments")}
                      className={activeTab === "comments" ? "text-emerald-400 font-bold" : "text-zinc-500 hover:text-white"}
                    >
                      Comments
                    </button>
                    <button
                      onClick={async () => {
                        setActiveTab("holders");
                        if (!topHolders.length) await loadTopHolders();
                      }}
                      className={activeTab === "holders" ? "text-emerald-400 font-bold" : "text-zinc-500 hover:text-white"}
                    >
                      Top Holders
                    </button>
                    <button
                      onClick={async () => {
                        setActiveTab("activity");
                        if (!activity.length) await loadActivity();
                      }}
                      className={activeTab === "activity" ? "text-emerald-400 font-bold" : "text-zinc-500 hover:text-white"}
                    >
                      Live Activity
                    </button>
                  </div>

                  {activeTab === "comments" && (
                    <>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your prediction..."
                        className="w-full h-[72px] bg-transparent px-4 pt-4 outline-none resize-none"
                      />
                      <div className="flex items-center justify-between px-3 py-3 border-t border-white/10">
                        {showEmojiPicker && (
                          <div className="absolute mb-3 bottom-full shadow-2xl left-0 z-50">
                            <EmojiPicker onEmojiClick={onEmojiClick} lazyLoadEmojis={true} />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="h-10 w-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition flex items-center justify-center text-lg"
                        >
                          😊
                        </button>
                        <button
                          onClick={postComment}
                          disabled={postingComment || !newComment.trim()}
                          className="px-5 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold transition"
                        >
                          {postingComment ? "Posting..." : "Post"}
                        </button>
                      </div>
                    </>
                  )}

                  {activeTab === "comments" && (
                    <div className="space-y-4 p-4">
                      {comments.length === 0 && (
                        <div className="text-zinc-500">No Comments Yet.</div>
                      )}
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-black border border-white/10 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <UserPreview username={comment.username} />
                            <div className="text-xs text-zinc-500">
                              {new Date(comment.created_at).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-zinc-300 whitespace-pre-wrap">{comment.content}</p>
                          <div className="flex items-center gap-5 mt-4">
                            <button
                              onClick={() => likeComment(comment.id)}
                              className={`transition ${comment.liked_by_me ? "text-red-500" : "text-zinc-500 hover:text-red-400"}`}
                            >
                              ❤️ {comment.likes}
                            </button>
                            <button
                              onClick={() => toggleReply(comment.id)}
                              className="text-zinc-500 hover:text-emerald-400 transition"
                            >
                              💬 {comment.reply_count ?? 0}
                            </button>
                          </div>

                          {activeReply === comment.id && (
                            <div className="mt-4">
                              <textarea
                                value={replyTexts[comment.id] || ""}
                                onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                placeholder="Write a reply..."
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 outline-none resize-none"
                              />
                              <button
                                onClick={() => submitReply(comment.id)}
                                className="mt-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-xl"
                              >
                                Reply
                              </button>
                            </div>
                          )}

                          {replies[comment.id]?.length > 0 && (
                            <div className="mt-4 ml-8 space-y-3">
                              {replies[comment.id].map((reply) => (
                                <div key={reply.id} className="bg-zinc-900 border border-white/10 rounded-xl p-3">
                                  <UserPreview username={reply.username} />
                                  <div className="text-zinc-300 mt-1">{reply.content}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "holders" && (
                    <div className="p-5 space-y-3">
                      {topHolders.map((holder, index) => (
                        <div key={holder.username} className="flex items-center justify-between bg-black border border-white/10 rounded-xl p-4">
                          <div>
                            <div className="font-bold flex gap-2">
                              <span>#{index + 1}</span>
                              <UserPreview username={holder.username} />
                            </div>
                            <div className="text-sm text-zinc-500">Largest holder</div>
                          </div>
                          <div className="text-emerald-400 font-bold">{holder.shares}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "activity" && (
                    <div className="p-5 space-y-3">
                      {displayActivity.map((item) => (
                        <div key={item.id} className="bg-black border border-white/10 rounded-xl p-4">
                          <div className="text-zinc-300">
                            <UserPreview username={item.username} /> {item.action}{" "}
                            <span className="font-bold">{item.shares}</span> shares of{" "}
                            <span className="text-emerald-400">{item.outcome}</span> at{" "}
                            <span className="font-bold">{item.price}¢</span>
                          </div>
                          <div className="text-xs text-zinc-500 mt-2">
                            {new Date(item.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RULES PANEL (FIXED) */}
              <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 h-fit sticky top-6">
                <div className="flex items-center gap-6 mb-5 border-b border-white/10 pb-3">
                  <button
                    onClick={() => setRulesTab("rules")}
                    className={rulesTab === "rules" ? "text-emerald-400 font-bold" : "text-zinc-500 hover:text-white"}
                  >
                    Rules
                  </button>

                  <button
                    onClick={() => setRulesTab("positions")}
                    className={
                      rulesTab === "positions"
                        ? "text-emerald-400 font-bold"
                        : "text-zinc-500 hover:text-white"
                    }
                  >
                    My Positions
                  </button>

                  {market.market_type === "bundle" && (
                    <button
                      onClick={() => setRulesTab("predictions")}
                      className={rulesTab === "predictions" ? "text-emerald-400 font-bold" : "text-zinc-500 hover:text-white"}
                    >
                      Predictions
                    </button>
                  )}
                </div>

                {/* Fix applied: Blocks cleanly isolated below tab buttons */}
                {rulesTab === "rules" && (
                  <div className="whitespace-pre-wrap text-zinc-300">
                    {market.rules || "No rules provided."}
                  </div>
                )}

                {rulesTab === "predictions" && market.market_type === "bundle" && (
                  <div className="space-y-3">
                    {market.bundle_predictions?.length ? (
                      market.bundle_predictions.map((prediction: string, index: number) => (
                        <div key={index} className="bg-black border border-white/10 rounded-xl p-4">
                          <div className="text-emerald-400 font-bold mb-2">Prediction #{index + 1}</div>
                          <div className="text-zinc-300">{prediction}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-500">No predictions found.</div>
                    )}
                  </div>
                )}

                {rulesTab === "positions" && (

                  <div className="mt-4 space-y-3">

                    {myPositions.length === 0 ? (

                      <div className="text-zinc-500">
                        You have no positions.
                      </div>
                    ) : (
                      myPositions.map((position) => (

                        <div
                          key={position.id}
                          className="
                           bg-black
                           border
                           border-white/10
                           rounded-xl
                           p-4
                          "
                        >
                          <div className="font-bold text-emerald-400">
                            {position.outcome}
                          </div>

                          <div className="text-zinc-400 mt-2">
                            
                            Shares:
                            {" "}
                            {Number(position.shares).toFixed(2)}

                          </div>

                          <div className="text-zinc-400">

                            Avg Cost:
                            {" "}
                            {(Number(position.avg_cost) * 100).toFixed(0)}¢

                          </div>

                          <div className="text-zinc-400">

                            Invested:
                            {" "}
                            K
                            {(
                              Number(position.shares) *
                              Number(position.avg_cost)
                            ).toFixed(2)}

                          </div>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={sharesToSell[position.id] || ""}
                            onChange={(e) =>
                              setSharesToSell(prev => ({
                                ...prev,
                                [position.id]: e.target.value,
                              }))
                            }
                            placeholder={`Max ${Number(position.shares).toFixed(2)} shares`}
                            className="
                              w-full
                              bg-zinc-900
                              border
                              border-white/10
                              rounded-xl
                              px-3
                              py-2
                              outline-none
                            "
                          />

                          <button
                            onClick={() =>
                              panicCashout(position.id,
                                Number(
                                  sharesToSell[position.id] ||
                                  position.shares
                                )
                              )
                            }
                            className="
                              mt-4
                              w-full
                              bg-red-500
                              hover:bg-red-400
                              text-black
                              font-bold
                              py-2
                              rounded-xl
                            "
                          >
                            Cash Out
                          </button>

                        </div>
                      ))
                    )}
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="font-semibold text-white mb-1">Trading Deadline</div>
                  <div className="text-emerald-400 font-bold">
                    {new Date(market.end_date).toLocaleString()}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="font-semibold text-white mb-1">Total Volume</div>
                  <div className="mt-2">
                    <div className="text-sm font-bold text-zinc-400">
                      KES
                    </div>

                    <div
                      className="
                        font-black
                        text-emerald-400
                        leading-none
                        break-all
                        text-[clamp(1rem,4vw,1.5rem)]
                      "
                    >
                      {Number(market.totalvolume ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
