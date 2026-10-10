/** Subtle grain over the page plus two soft gradient blobs drifting behind the hero. Decorative only. */
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[90vh] overflow-hidden print:hidden">
      <div className="blob blob-a absolute -left-32 top-10 h-[34rem] w-[34rem] rounded-full bg-sage-400/35 blur-3xl dark:bg-sage-600/20" />
      <div className="blob blob-b absolute -right-24 top-40 h-[30rem] w-[30rem] rounded-full bg-lamp/30 blur-3xl dark:bg-[#6a4f8f]/25" />
    </div>
  );
}
