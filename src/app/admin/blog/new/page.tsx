"use client";

import { useState } from "react";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);

  function insertHtml(before: string, after = "") {

    const textarea = document.getElementById(
      "blog-editor"
    ) as HTMLTextAreaElement;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = content.substring(start, end);

    const newText =
      content.substring(0, start) +
      before +
      selected +
      after +
      content.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd =
        start + before.length + selected.length;
    }, 0);
  }

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

        <div className="border border-white/10 rounded-2xl overflow-hidden">

          <div className="flex flex-wrap gap-2 p-3 bg-zinc-950 border-b border-white/10">

            <button
              onClick={() => insertHtml("<strong>", "</strong>")}
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              <b>B</b>
            </button>

            <button
              onClick={() => insertHtml("<em>", "</em>")}
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 italic"
            >
              I
            </button>

            <button
              onClick={() => insertHtml("<u>", "</u>")}
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 underline"
            >
              U
            </button>

            <button
              onClick={() => insertHtml("<h1>", "</h1>")}
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              H1
            </button>

            <button
              onClick={() => insertHtml("<h2>", "</h2>")}
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              H2
            </button>

            <button
              onClick={() => insertHtml("<h3>", "</h3>")}
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              H3
            </button>

            <button
              onClick={() =>
                insertHtml("<blockquote>", "</blockquote>")
              }
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              " Quote
            </button>

            <button
              onClick={() =>
                insertHtml("<ul>\n<li>", "</li>\n</ul>")
              }
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              • List
            </button>

            <button
              onClick={() =>
                insertHtml("<code>", "</code>")
              }
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              {"</>"}
            </button>

            <button
              onClick={() =>
                insertHtml(
                  `<a href="">`,
                  `</a>`
                )
              }
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              Link
            </button>

            <button
              onClick={() =>
                insertHtml(
                  `<img src="" alt="" style="width:100%;border-radius:12px;" />`
                )
              }
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              Img
            </button>

            <button
              onClick={() =>
                insertHtml(
                  `<iframe width="100%" height="500" src="" frameborder="0" allowfullscreen></iframe>`
                )
              }
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              Youtube
            </button>

            <button
              onClick={() =>
                insertHtml("<hr>")
              }
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              ─ Divider
            </button>

            <button
              onClick={() => setPreview(!preview)}
              className="
                ml-auto
                px-4
                py-2
                rounded
                bg-emerald-600
                hover:bg-emerald-500
              "
            >
              {preview ? "Edit" : "Preview"}
            </button>
          </div>

          {preview ? (
            <div
              className="
                bg-white
                text-black
                p-8
                min-h-[600px]
                prose
                max-w-none
              "
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          ) : (
            <textarea
              id="blog-editor"
              value={content}
              onChange={(e)=>setContent(e.target.value)}
              className="
                w-full
                h-[600px]
                bg-zinc-900
                p-5
                resize-none
                outline-none
              "
            />
          )}
        </div>

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
