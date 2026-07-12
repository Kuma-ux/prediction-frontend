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

      <div className="max-w-4xl mx-auto px-6 py-10">

        <Link
          href="/news/blog"
          className="text-emerald-600 font-semibold"
        >
          ← Back to News
        </Link>

        <div className="mt-8">

          <div className="uppercase tracking-widest text-sm font-bold text-emerald-600">
            {blog.category}
          </div>

          <h1 className="text-6xl font-black text-black leading-tight mt-4">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="text-2xl text-neutral-600 mt-6">
              {blog.subtitle}
            </p>
          )}

          <div className="flex items-center gap-3 mt-8 text-neutral-500">

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
            className="w-full rounded-3xl mt-10"
          />
        )}

        <article
          className="
            mt-12
            bg-white
            rounded-3xl
            p-10
            shadow-sm

            prose
            prose-xl
            max-w-none

            prose-headings:text-black
            prose-p:text-neutral-700
            prose-a:text-emerald-600
            prose-strong:text-black
            prose-blockquote:border-emerald-500
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
