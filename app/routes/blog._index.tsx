import type { Route } from "./+types/blog._index";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";
import { getAllBlogPosts } from "../lib/blog-data";
import { BookOpen, Clock, Calendar, ArrowRight, ArrowLeft, Tag } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kilo Blog & Guides — Media Optimization, WebP & E-Commerce Speed" },
    {
      name: "description",
      content:
        "Practical engineering guides on image compression, WebP vs PNG comparisons, client-side privacy, and Core Web Vitals optimization for Shopify merchants.",
    },
    { name: "robots", content: "index, follow" },
    {
      name: "keywords",
      content:
        "image compression guides, webp optimization, shopify store speed, core web vitals, client side image processing blog",
    },
    { property: "og:title", content: "Kilo Blog & Media Optimization Guides" },
    {
      property: "og:description",
      content:
        "In-depth guides on modern image formats, Core Web Vitals, and in-browser media compression.",
    },
    { property: "og:url", content: "https://kilo.nazmulcodes.org/blog" },
    { property: "og:type", content: "website" },
  ];
}

export default function BlogIndex() {
  const posts = getAllBlogPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kilo Blog & Optimization Guides",
    url: "https://kilo.nazmulcodes.org/blog",
    description:
      "Expert articles on image compression, Core Web Vitals, and client-side processing.",
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://kilo.nazmulcodes.org/blog/${post.slug}`,
      datePublished: "2026-09-16",
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderNavigation />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Back navigation */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Kilo Tool</span>
        </a>

        {/* Hero title */}
        <div className="border-b border-slate-800/80 pb-8 mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold text-sky-300 bg-sky-950/80 border border-sky-500/30">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Guides &amp; Engineering Insights</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Media Optimization &amp; Web Performance Blog
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Technical guides, format benchmarks, and e-commerce optimization tactics to help you boost conversions and master Google's Core Web Vitals.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700 transition-all duration-300 p-6 group shadow-lg"
            >
              <div className="space-y-4">
                {/* Category & Read Time */}
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    <span>{post.category}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  <a href={`/blog/${post.slug}`} className="focus:outline-none">
                    {post.title}
                  </a>
                </h2>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Bottom metadata */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>{post.publishedDate}</span>
                </div>

                <a
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      <FooterCredits />
    </div>
  );
}
