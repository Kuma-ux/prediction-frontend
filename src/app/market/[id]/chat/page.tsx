"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { socket } from "@/lib/socket";
import Link from "next/link";

export default function MarketChatPage() {

  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const marketId = params.id;

  const colors = [
    "bg-emerald-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-yellow-500",
  ];

  const [replyingTo, setReplyingTo] =
    useState<ChatMessage | null>(null);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  function getUserColor(username: string) {
    let hash = 0;

    for (let i = 0; i < username.length; i++) {
        hash += username.charCodeAt(i);
    }

    return colors[hash % colors.length];
  }

  function renderMessage(text: string) {
    return text
      .split(/(@\w+)/g)
      .map((part, index) => {
        if (part.startsWith("@")) {

            const username =
              part.replace("@", "");
            
            return(
                <Link
                  key={index}
                  href={`/profile/${username}`}
                  className="
                    inline-block
                    text-cyan-300
                    bg-cyan-500/10
                    px-1.5
                    rounded
                    font-semibold
                    hover:bg-cyan-500/20
                    hover:text-cyan-200
                    transition
                  "
                >
                    {part}
                </Link>
            );
        }

        return (
            <span key={index}>
                {part}
            </span>
        );
      });
  }

  type ChatMessage = {
    id: number;
    username: string;
    message: string;
    created_at: string;
    reply_to_username?: string;
    reactions?: {
        emoji: string;
        count: number;
    }[];
    user_reactions?: string[];
    image_url?: string;
  };
  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadMessages() {

    const res = await fetch(
      `https://prediction-backend-production-05b8.up.railway.app/markets/${marketId}/chat`
    );

    const data = await res.json();

    if (data.success) {
      setMessages(data.messages);
    }
  }

  async function sendMessage() {

    if (!message.trim() && !selectedImage) return;

    const formData = new FormData();

    formData.append(
      "message",
      message
    );

    if (selectedImage) {
      formData.append(
        "image",
        selectedImage
      );
    }

    if (replyingTo?.id) {
      formData.append(
        "replyToId",
        replyingTo.id.toString()
      );

      formData.append(
        "replyToUsername",
        replyingTo.username
      );
    }

    const res = await fetch(
      `https://prediction-backend-production-05b8.up.railway.app/markets/${marketId}/chat`,
      {
        method: "POST",
        credentials: "include",
        body: formData
      }
    );

    const data = await res.json();

    if (data.success) {
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      setReplyingTo(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function reactToMessage(
    messageId: number,
    emoji: string
  ) {

    const msg = messages.find(m => m.id === messageId);

    console.log(msg);
    console.log(msg?.user_reactions);

    const alreadyReacted =
      msg?.user_reactions?.includes(emoji);

    setMessages(prev =>
      prev.map(msg => {

        if (msg.id !== messageId)
          return msg;

        return {
          ...msg,
          user_reactions: alreadyReacted
            ? (msg.user_reactions || []).filter(
              e => e !== emoji
              )
            : [
              ...(msg.user_reactions || []),
              emoji
            ]
        };
      })
    );
    
    try {
        await fetch(
            `https://prediction-backend-production-05b8.up.railway.app/markets/chat/${messageId}/react`,
            {
                method:
                  alreadyReacted
                    ? "DELETE"
                    : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    emoji
                })
            }
        );
    } catch (err) {
        console.error(err);
    }
  }

  async function uploadImage() {
    if (!selectedImage) return;

    const formData = new FormData();

    formData.append(
      "image",
      selectedImage
    );

    const res = await fetch(
      `https://prediction-backend-production-05b8.up.railway.app/markets/${marketId}/chat/image`,
      {
        method: "POST",
        credentials: "include",
        body: formData
      }
    );

    const data = await res.json();

    if (data.success) {
      setSelectedImage(null);
    }
  }

  useEffect(() => {

    loadMessages();

    socket.connect();

    socket.emit(
        "join_market",
        marketId
    );

    socket.on(
        "new_message",
        (newMessage) => {

            setMessages(prev => [
                ...prev,
                newMessage
            ]);
        }
    );

    socket.on(
        "message_reaction",
        ({ messageId, reactions }) => {

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId
                    ? {
                        ...msg,
                        reactions
                    }
                    : msg
                )
            );
        }
    );

    return () => {
        socket.emit(
            "leave_market",
            marketId
        );

        socket.off(
            "new_message"
        );
        socket.off("message_reaction");

        socket.disconnect();
    };

  }, [marketId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
        behavior: "smooth"
    });
  }, [messages]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">

      <div
        className="
          sticky top-0 z-20
          backdrop-blur-xl
          bg-black/60
          border-b border-white/10
          px-6 py-5
        "
      >
        <h1 className="text-3xl font-black">
            Market Chat
        </h1>

        <p className="text-zinc-500 mt-1">
            Discuss trades, probabilities and predictions.
        </p>
      </div>

      <div className="h-[calc(100vh-180px)] overflow-y-auto px-6 py-6 space-y-4">

        {messages.map((msg:any) => (
          <div
            key={msg.id}
            className="
              flex
              items-start
              gap-3
              animate-in
              fade-in
            "
          >
            <div
              className={`
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                text-sm
                font-black
                text-white
                shrink-0
                ${getUserColor(msg.username)}
              `}
            >
                {msg.username.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">

                <div className="flex items-center gap-3">

                    <span
                      className={`
                        font-bold
                        ${getUserColor(msg.username).replace("bg-", "text-")}
                      `}
                    >
                        {msg.username}
                    </span>

                    <span className="text-xs text-zinc-500">
                        {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                </div>

                <div
                  className="
                    mt-2
                    inline-block
                    bg-zinc-900
                    border
                    border-white/10
                    rounded-2xl
                    px-4
                    py-3
                    max-w-[85%]
                    break-words
                  "
                >
                    {msg.reply_to_username && (
                        <div
                          className="
                            mb-2
                            p-2
                            rounded-lg
                            bg-black/40
                            border-l-2
                            border-emerald-500
                            text-xs
                          "
                        >
                            Replying to @{msg.reply_to_username}
                        </div>
                    )}

                    {msg.message && renderMessage(msg.message)}

                    {msg.image_url && (
                      <img
                        src={`https://prediction-backend-production-05b8.up.railway.app${msg.image_url}`}
                        alt="chat image"
                        className="
                          mt-3
                          rounded-xl
                          max-w-sm
                          border
                          border-white/10
                        "
                      />
                    )}
                </div>

                <button
                  onClick={() => setReplyingTo(msg)}
                  className="
                    mt-2
                    text-xs
                    text-zinc-500
                    hover:text-emerald-400
                  "
                >
                    ↩
                </button>

                <div className="flex gap-1 mt-2">

                    {["👍","🔥","🚀","😂","❤️"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() =>
                            reactToMessage(
                                msg.id,
                                emoji
                            )
                          }
                          className={`
                            text-lg
                            transition
                            ${
                              msg.user_reactions?.includes(emoji)
                                ? "opacity-100 scale-110"
                                : "opacity-40 hover:opacity-100"
                            }
                          `}
                        >
                            {emoji}
                        </button>
                    ))}

                </div>

                <div className="flex gap-2 mt-2 flex-wrap">

                    {msg.reactions?.map((reaction:any) => (

                        <button
                          key={reaction.emoji}
                          className="
                            px-2
                            py-1
                            rounded-full
                            bg-zinc-800
                            border
                            border-white/10
                            text-sm
                          "
                        >
                            {reaction.emoji}
                            <span className="ml-1">
                                {reaction.count}
                            </span>
                        </button>
                    ))}

                </div>

            </div>
          </div>
        ))}

        <div ref={bottomRef} />

      </div>

      <div className="sticky bottom-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-5">
        {replyingTo && (

        <div
          className="
            mb-3
            bg-zinc-900
            border
            border-white/10
            rounded-xl
            p-3
            flex
            justify-between
            items-center
          "
        >
            <div>
                <div className="text-xs text-emerald-400">
                    Replying to {replyingTo.username}
                </div>

                <div className="text-sm text-zinc-400 truncate">
                    {replyingTo.message}
                </div>
            </div>

            <button
              onClick={() => setReplyingTo(null)}
              className="text-red-400"
            >
                ✕
            </button>
        </div>
      )}

      {imagePreview && (
          <div className="mb-4 relative w-fit">

            <img
              src={imagePreview}
              alt="Preview"
              className="
                w-40
                max-h-56
                object-cover
                rounded-xl
                border
                border-white/10
              "
            />

            <button
              onClick={() =>{

                setSelectedImage(null);
                setImagePreview(null);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="
                absolute
                top-2
                right-2
                w-7
                h-7
                rounded-full
                bg-black/80
                text-red-400
                hover:bg-red-500
                hover:text-white
                transition
              "
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex gap-3">

        <input
          value={message}
          onChange={(e)=>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="
            flex-1
            bg-zinc-900
            border
            border-white/10
            rounded-2xl
            px-5
            py-4
            outline-none
            focus:border-emerald-500
            transition
          "
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>{

            const file =
              e.target.files?.[0];

            if (!file) return;

            setSelectedImage(file);
            
            setImagePreview(
              URL.createObjectURL(file)
            )}
          }
        />

        <button
          onClick={() =>
            fileInputRef.current?.click()
          }
          className={`
            px-4
            rounded-xl
            text-xl
            transition
            ${
              selectedImage
                ? "bg-emerald-500 text-black"
                : "bg-zinc-800"
            }
          `}
        >
          📷
        </button>

        <button
          onClick={sendMessage}
          className="
            px-8
            rounded-2xl
            font-black
            bg-gradient-to-r
            from-emerald-500
            to-green-400
            text-black
            hover:scale-105
            transition
          "
        >
          Send
        </button>

        </div>

      </div>

    </main>
  );
}
