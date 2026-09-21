import type { Route } from "./+types/blog.$slug";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";
import { getBlogPostBySlug, getAllBlogPosts } from "../lib/blog-data";
import {
  Clock,
  Calendar,
  ArrowLeft,
  Tag,
  ExternalLink,
  Zap,
  ArrowRight,
} from "lucide-react";

export function meta({ params }: Route.MetaArgs) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return [{ title: "Post Not Found — Kilo" }];
  }

  const pagetitle =  post.title.length > 48 ?  post.title : `${post.title} | Kilo Guide`;

  return [
    { title: pagetitle },
    { name: "description", content: post.excerpt },
    { name: "robots", content: "index, follow" },
    { name: "keywords", content: post.keywords.join(", ") },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://kilo.nazmulcodes.org/blog/${post.slug}` 
    },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.excerpt },
    { property: "og:url", content: `https://kilo.nazmulcodes.org/blog/${post.slug}` },
    { property: "og:type", content: "article" },
  ];
}

export default function BlogPostDetail({ params }: Route.ComponentProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <HeaderNavigation />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="text-3xl font-extrabold text-white">Guide Not Found</h1>
          <p className="text-slate-400 text-sm">
            The article you are looking for does not exist or has been moved.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Blog Hub</span>
          </a>
        </main>
        <FooterCredits />
      </div>
    );
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `https://kilo.nazmulcodes.org/blog/${post.slug}`,
    datePublished: "2026-09-16",
    dateModified: "2026-09-16",
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
      url: post.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: "Kilo",
      url: "https://kilo.nazmulcodes.org",
      logo: {
        "@type": "ImageObject",
        url: "https://kilo.nazmulcodes.org/logo.png",
      },
    },
    keywords: post.keywords,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderNavigation />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Back Link */}
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Guides</span>
        </a>

        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-800/80 pb-8 mb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-3 py-0.5 rounded-full">
              <Tag className="w-3 h-3" />
              <span>{post.category}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.publishedDate}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          {/* Author Byline */}
          <div className="flex items-center gap-3 pt-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-1.5 object-contain"
            />
            <div className="text-xs">
              <a
                href={post.author.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
              >
                <span>{post.author.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-slate-400">{post.author.role}</p>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article
          className="prose prose-invert prose-emerald max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-300 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-200 [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Inline Conversion CTA */}
        <div className="mt-14 p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Ready to compress your images?</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              Try Kilo now. 100% private, client-side WebP, PNG, JPEG, and ICO conversion in your browser memory.
            </p>
          </div>
          <a
            href="/"
            className="flex-shrink-0 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Launch Kilo Tool
          </a>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-800/80 space-y-6">
            <h3 className="text-xl font-bold text-white">More Guides &amp; Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rel) => (
                <a
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all block group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {rel.category}
                  </span>
                  <h4 className="font-bold text-white text-sm sm:text-base mt-2 group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium mt-4 group-hover:translate-x-1 transition-transform">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      <FooterCredits />
    </div>
  );
}
