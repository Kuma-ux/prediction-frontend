"use client";

import { useState } from "react";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-black mb-10">
        Publish Blog
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">

        <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Blog title"
          className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-2xl"
        />

        <input
          value={subtitle}
          onChange={(e)=>setSubtitle(e.target.value)}
          placeholder="Subtitle"
          className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4"
        />

        <input
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          placeholder="Category"
          className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4"
        />

        <input
          value={tags}
          onChange={(e)=>setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4"
        />

        <textarea
          value={content}
          onChange={(e)=>setContent(e.target.value)}
          placeholder="Write your article..."
          className="
            w-full
            h-[500px]
            bg-zinc-900
            border
            border-white/10
            rounded-xl
            p-5
            resize-none
          "
        />

        <div className="flex justify-end gap-4">

          <button
            className="
              border
              border-white/10
              px-6
              py-3
              rounded-xl
            "
          >
            Save Draft
          </button>

          <button
            className="
              bg-emerald-500
              hover:bg-emerald-400
              text-black
              px-6
              py-3
              rounded-xl
              font-bold
            "
          >
            Publish
          </button>

        </div>

      </div>

    </main>
  );
}
