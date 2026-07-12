"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  featured_image: string;
  published_at: string;
}

export default function BlogHome() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(
        blogs
        .map(blog => blog.category)
        .filter(Boolean)
      )
    ),
  ];

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    try {
      const res = await fetch(
        "https://api.theprobability.site/blog",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center">
        Loading...
      </main>
    );
  }

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter(
        blog => blog.category === selectedCategory
      );

  const hero = filteredBlogs[0];
  const featured = filteredBlogs.slice(1,5);
  const latest = filteredBlogs.slice(5);

  return (
    <main className="min-h-screen bg-neutral-100">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex justify-between items-end mb-10">

          <div>

            <h1 className="text-5xl font-black text-black">
              Probability News
            </h1>

            <p className="text-neutral-600 mt-2">
              Market intelligence • Politics • Finance • Sports • Technology
            </p>

          </div>

        </div>

        {hero && (

          <Link
            href={`/news/blog/${hero.slug}`}
            className="block"
          >

            <div className="grid lg:grid-cols-2 gap-8 mb-16">

              <img
                src={hero.featured_image || "/placeholder.jpg"}
                className="rounded-3xl h-[500px] object-cover w-full"
              />

              <div className="flex flex-col justify-center">

                <div className="uppercase text-sm font-bold text-emerald-600 tracking-widest mb-4">
                  {hero.category}
                </div>

                <h2 className="text-6xl font-black leading-tight text-black">
                  {hero.title}
                </h2>

                <p className="mt-6 text-xl text-neutral-700">
                  {hero.subtitle}
                </p>

                <div className="mt-10 text-neutral-500">
                  {new Date(hero.published_at).toLocaleDateString()}
                </div>

              </div>

            </div>

          </Link>

        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">

          {featured.map(blog => (

            <Link
              key={blog.id}
              href={`/news/blog/${blog.slug}`}
            >

              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">

                <img
                  src={blog.featured_image || "/placeholder.jpg"}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">

                  <div className="text-xs uppercase text-emerald-600 font-bold mb-2">
                    {blog.category}
                  </div>

                  <h3 className="font-bold text-lg text-black line-clamp-3">
                    {blog.title}
                  </h3>

                </div>

              </div>

            </Link>

          ))}

        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2">

            <h2 className="text-3xl font-black mb-8 text-black">
              Latest News
            </h2>

            <div className="space-y-8">

              {latest.map(blog => (

                <Link
                  key={blog.id}
                  href={`/news/blog/${blog.slug}`}
                >

                  <div className="flex gap-6 bg-white rounded-2xl overflow-hidden hover:shadow-md transition">

                    <img
                      src={blog.featured_image || "/placeholder.jpg"}
                      className="w-64 h-44 object-cover"
                    />

                    <div className="p-6 flex flex-col justify-center">

                      <div className="uppercase text-xs font-bold text-emerald-600">
                        {blog.category}
                      </div>

                      <h3 className="text-2xl font-black mt-2 text-black">
                        {blog.title}
                      </h3>

                      <p className="text-neutral-600 mt-3">
                        {blog.subtitle}
                      </p>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          </div>

          <aside>

            <div className="bg-white rounded-2xl p-6">

              <h3 className="text-xl font-black mb-6 text-black">
                Trending Categories
              </h3>

              <div className="space-y-4">

                {categories.map(category => (

                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={` w-full text-left p-3 rounded-xl font-semibold transition ${ selectedCategory === category ? "bg-emerald-500 text-white" : "hover:bg-neutral-100 text-black" }`}
                  >
                    {category}
                  </button>

                ))}

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}
