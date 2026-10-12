import { FaArrowRight } from "react-icons/fa6";
import posts, { formatDate } from "../../blog/posts";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const LATEST = 3;

/** The newest posts as cards; the full list lives at "#blog". */
export default function Blog() {
  const latest = posts.slice(0, LATEST);
  return (
    <section id="blog" aria-labelledby="blog-heading" className="scroll-mt-24">
      <SectionHeading index={6} id="blog" title="Blog" lede="Build logs from my desk: what I shipped, what broke, and what I learned." />
      {latest.length === 0 ? (
        <Reveal>
          <p className="text-ink/70 dark:text-cream/70">Nothing here yet. The first post is on its way.</p>
        </Reveal>
      ) : (
        <ol className="flex flex-col gap-5">
          {latest.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={i * 80}>
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
                  <p className="text-sm text-ink/60 dark:text-cream/60">
                    <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} min read
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-sage-700 dark:group-hover:text-sage-300 sm:text-2xl">{post.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/80 dark:text-cream/80">{post.summary}</p>
                  {post.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
                      {post.tags.map((tag) => (
                        <li key={tag} className="rounded-md bg-sage-400/20 px-2 py-0.5 text-xs font-medium text-sage-700 dark:bg-sage-600/25 dark:text-sage-300">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-sage-700 dark:text-sage-300">
                    Read post <FaArrowRight size={11} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </ol>
      )}
      {posts.length > LATEST && (
        <Reveal className="mt-6">
          <a href="#blog" className="inline-flex items-center gap-2 rounded text-sm font-medium text-sage-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:text-sage-300">
            All {posts.length} posts <FaArrowRight size={11} aria-hidden="true" />
          </a>
        </Reveal>
      )}
    </section>
  );
}
