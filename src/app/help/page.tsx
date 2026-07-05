'use client'

import { useState } from "react";

export default function HelpPage() {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function sendHelpRequest() {

    if (!subject || !message) {
      alert("Please fill all fields");
      return;
    }

    try {

      setSending(true);

      const res = await fetch(
        "https://prediction-backend-production-05b8.up.railway.app/support/contact",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            message,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed");
        return;
      }

      alert("Message sent");

      setSubject("");
      setMessage("");

    } catch (err) {

      console.error(err);

      alert("Failed to send message");

    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-3xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-black mb-4">
          Help Center
        </h1>

        <p className="text-zinc-400 mb-10">
          Need help? Send us a message and we'll get back to you.
        </p>

        <div className="
          bg-zinc-950
          border
          border-white/10
          rounded-3xl
          p-6
        ">

          <input
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
            placeholder="Subject"
            className="
              w-full
              bg-zinc-900
              border
              border-white/10
              rounded-xl
              px-4
              py-4
              mb-4
            "
          />

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Describe your issue..."
            rows={10}
            className="
              w-full
              bg-zinc-900
              border
              border-white/10
              rounded-xl
              px-4
              py-4
              mb-6
            "
          />

          <button
            onClick={sendHelpRequest}
            disabled={sending}
            className="
              bg-emerald-500
              text-black
              px-8
              py-4
              rounded-xl
              font-black
            "
          >
            {sending
              ? "Sending..."
              : "Send Message"}
          </button>

        </div>

      </div>

    </main>
  );
}
