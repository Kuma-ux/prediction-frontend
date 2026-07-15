"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  featured_image: string;
  content: string;
  author: string;
  published_at: string;
}

export default function BlogArticle() {
  const { slug } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, []);

  async function loadBlog() {
    try {
      const res = await fetch(
        `https://api.theprobability.site/blog/${slug}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.success) {
        setBlog(data.blog);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center">
        Loading article...
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Article not found.
      </main>
    );
  }

  return (
    <main className="bg-neutral-100 min-h-screen">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <Link
          href="/news/blog"
          className="inline-flex items-center text-sm sm:text-base text-emerald-600 font-semibold hover:underline"
        >
          ← Back to News
        </Link>

        <div className="mt-8">

          <div className="uppercase tracking-widest text-sm font-bold text-emerald-600">
            {blog.category}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black leading-tight mt-4">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="text-base sm:text-xl lg:text-2xl text-neutral-600 leading-relaxed mt-5">
              {blog.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-6 text-sm sm:text-base text-neutral-500">

            <span>
              By {blog.author}
            </span>

            <span>•</span>

            <span>
              {new Date(blog.published_at).toLocaleDateString()}
            </span>

          </div>

        </div>

        {blog.featured_image && (
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="w-full rounded-2xl sm:rounded-3xl object-cover max-h-[520px] mt-8 "
          />
        )}

        <article
          className="
            mt-8
            sm:mt-12
            bg-white
            rounded-2xl
            sm:rounded-3xl
            p-5
            sm:p-8
            lg:p-10
            shadow-sm

            prose
            sm:prose-lg
            lg:prose-xl
            prose-img:w-full
            prose-img:h-auto
            max-w-none

            prose-headings:text-black
            prose-p:text-neutral-700
            prose-a:text-emerald-600
            prose-strong:text-black
            prose-blockquote:border-emerald-500
            prose-table:block
            prose-table:overflow-x-auto
            prose-pre:overflow-x-auto
            prose-pre:rounded-xl
            prose-code:text-emerald-600
            prose-img:rounded-2xl
          "
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />

      </div>

    </main>
  );
}
