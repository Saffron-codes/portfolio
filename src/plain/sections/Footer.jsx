import profile from "../../data/profile";

export default function Footer({ onOpenDesk }) {
  return (
    <footer className="border-t border-ink/10 py-8 text-center text-sm text-ink/70 dark:border-cream/10 dark:text-cream/70">
      <p>
        © {new Date().getFullYear()} {profile.name} · Built with React &amp; Three.js
      </p>
      {onOpenDesk && (
        <p className="mt-2 print:hidden">
          <a
            href="#desk"
            onClick={(event) => {
              event.preventDefault();
              onOpenDesk();
            }}
            className="rounded text-sage-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:text-sage-300"
          >
            Step into my desk in 3D →
          </a>
        </p>
      )}
    </footer>
  );
}
