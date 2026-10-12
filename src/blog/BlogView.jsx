import { useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaMoon, FaSun } from "react-icons/fa6";
import profile from "../data/profile";
import Footer from "../plain/sections/Footer";
import { iconButton, secondaryButton } from "../plain/styles";
import Markdown from "./Markdown";
import posts, { findPost, formatDate } from "./posts";

const BASE_TITLE = document.title;

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${profile.name}` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}

function Tags({ tags, className = "" }) {
  if (!tags.length) return null;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag} className="rounded-md bg-sage-400/20 px-2 py-0.5 text-xs font-medium text-sage-700 dark:bg-sage-600/25 dark:text-sage-300">
          {tag}
        </li>
      ))}
    </ul>
  );
}

function Meta({ post, className = "" }) {
  return (
    <p className={`text-sm text-ink/60 dark:text-cream/60 ${className}`}>
      <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} min read
    </p>
  );
}

/** Sticky top bar: wordmark home, then "All posts" (on a post), theme toggle and back to the portfolio. */
function BlogHeader({ theme, onToggleTheme, onPost }) {
  const isDark = theme === "dark";
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/85 backdrop-blur print:hidden dark:border-cream/10 dark:bg-night-900/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#" className="rounded-md text-base font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:text-cream">
          <span className="hidden sm:inline">{profile.name}</span>
          <span className="sm:hidden">SDT</span>
          <span className="ml-2 text-sm font-medium text-ink/50 dark:text-cream/50">/ Blog</span>
        </a>
        <nav aria-label="Blog" className="flex items-center gap-2">
          {onPost && (
            <a href="#blog" className={`${secondaryButton} hidden sm:inline-flex`}>
              <FaArrowLeft size={12} aria-hidden="true" /> All posts
            </a>
          )}
          <button type="button" onClick={onToggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={isDark} className={iconButton}>
            {isDark ? <FaSun size={15} aria-hidden="true" /> : <FaMoon size={15} aria-hidden="true" />}
          </button>
          <a href="#" className={secondaryButton}>
            <span className="sm:hidden">Portfolio</span>
            <span className="hidden sm:inline">Back to portfolio</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

function PostCard({ post }) {
  return (
    <li>
      <a
        href={`#blog/${post.slug}`}
        className="group flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white/70 shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 motion-reduce:transition-none dark:border-cream/10 dark:bg-night-800/70 dark:hover:shadow-black/40 sm:flex-row"
      >
        {post.cover && (
          <div className="overflow-hidden sm:w-60 md:w-72">
            <img
              src={post.cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none sm:aspect-auto"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center gap-3 p-6">
          <Meta post={post} />
          <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-sage-700 dark:group-hover:text-sage-300 sm:text-2xl">{post.title}</h2>
          <p className="text-sm leading-relaxed text-ink/80 dark:text-cream/80">{post.summary}</p>
          <Tags tags={post.tags} />
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-sage-700 dark:text-sage-300">
            Read post <FaArrowRight size={11} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </span>
        </div>
      </a>
    </li>
  );
}

function PostIndex() {
  useDocumentTitle("Blog");
  return (
    <>
      <div className="pb-10 pt-10 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-700 dark:text-sage-300">Blog</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Notes from my desk</h1>
        <p className="mt-4 max-w-2xl text-base text-ink/70 dark:text-cream/70">
          Build logs and write-ups on what I&apos;m shipping: what worked, what broke, and what I learned along the way.
        </p>
      </div>
      {posts.length ? (
        <ol className="flex flex-col gap-5">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </ol>
      ) : (
        <p className="text-ink/70 dark:text-cream/70">Nothing here yet. The first post is on its way.</p>
      )}
    </>
  );
}

function PostPage({ post }) {
  useDocumentTitle(post.title);
  const index = posts.indexOf(post);
  const newer = index > 0 ? posts[index - 1] : null;
  const older = index < posts.length - 1 ? posts[index + 1] : null;
  return (
    <article className="pt-8 sm:pt-12">
      <header className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-700 dark:text-sage-300">Blog</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
        <Meta post={post} className="mt-5" />
        {post.summary && <p className="mt-5 text-lg leading-relaxed text-ink/75 dark:text-cream/75">{post.summary}</p>}
        <Tags tags={post.tags} className="mt-5" />
      </header>
      {post.cover && (
        <figure className="mx-auto mt-10 max-w-3xl">
          <img
            src={post.cover}
            alt={post.coverAlt}
            decoding="async"
            className="aspect-[16/9] w-full rounded-3xl border border-ink/10 object-cover shadow-sm dark:border-cream/10"
          />
          {post.coverAlt && <figcaption className="mt-3 text-center text-sm text-ink/60 dark:text-cream/60">{post.coverAlt}</figcaption>}
        </figure>
      )}
      <Markdown source={post.body} className="mx-auto mt-10 max-w-2xl" />

      {(older || newer) && (
        <nav aria-label="More posts" className="mx-auto mt-16 flex max-w-2xl flex-col gap-3 border-t border-ink/10 pt-8 dark:border-cream/10 sm:flex-row sm:justify-between">
          {older ? (
            <a href={`#blog/${older.slug}`} className="group flex-1 rounded-2xl border border-ink/10 p-4 transition-colors hover:border-sage-600 dark:border-cream/10 dark:hover:border-sage-400">
              <span className="text-xs uppercase tracking-wider text-ink/50 dark:text-cream/50">Older</span>
              <span className="mt-1 block font-medium group-hover:text-sage-700 dark:group-hover:text-sage-300">{older.title}</span>
            </a>
          ) : (
            <span className="flex-1" />
          )}
          {newer ? (
            <a href={`#blog/${newer.slug}`} className="group flex-1 rounded-2xl border border-ink/10 p-4 text-right transition-colors hover:border-sage-600 dark:border-cream/10 dark:hover:border-sage-400">
              <span className="text-xs uppercase tracking-wider text-ink/50 dark:text-cream/50">Newer</span>
              <span className="mt-1 block font-medium group-hover:text-sage-700 dark:group-hover:text-sage-300">{newer.title}</span>
            </a>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      )}
      <p className={`mx-auto max-w-2xl ${older || newer ? "mt-8" : "mt-16 border-t border-ink/10 pt-8 dark:border-cream/10"}`}>
        <a href="#blog" className="inline-flex items-center gap-2 rounded text-sm font-medium text-sage-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:text-sage-300">
          <FaArrowLeft size={12} aria-hidden="true" /> All posts
        </a>
      </p>
    </article>
  );
}

function NotFound({ slug }) {
  useDocumentTitle("Post not found");
  return (
    <div className="py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-700 dark:text-sage-300">Blog</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">That post isn&apos;t here</h1>
      <p className="mt-4 max-w-xl text-ink/70 dark:text-cream/70">
        Nothing is published at <code className="rounded bg-ink/5 px-1.5 py-0.5 text-sm dark:bg-cream/10">{slug}</code>. It may have moved or never existed.
      </p>
      <a href="#blog" className={`${secondaryButton} mt-6`}>
        <FaArrowLeft size={12} aria-hidden="true" /> All posts
      </a>
    </div>
  );
}

/** The blog: "#blog" lists every post, "#blog/<slug>" shows one. */
export default function BlogView({ theme, onToggleTheme, slug }) {
  const post = slug ? findPost(slug) : null;

  // Each route starts at the top, like a normal page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  return (
    <div className="portfolio-page relative min-h-screen overflow-x-clip bg-cream text-ink dark:bg-night-900 dark:text-cream">
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main");
          main?.focus({ preventScroll: true });
          main?.scrollIntoView({ behavior: "auto", block: "start" });
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-sage-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <BlogHeader theme={theme} onToggleTheme={onToggleTheme} onPost={Boolean(slug)} />
      <main id="main" tabIndex={-1} className="relative mx-auto max-w-6xl px-4 pb-24 outline-none sm:px-6">
        {!slug ? <PostIndex /> : post ? <PostPage post={post} /> : <NotFound slug={slug} />}
      </main>
      <Footer />
    </div>
  );
}
