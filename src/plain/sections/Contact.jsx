import { useEffect, useState } from "react";
import { FaCheck, FaCopy, FaDownload, FaEnvelope } from "react-icons/fa6";
import profile from "../../data/profile";
import LinkIcon from "../../components/LinkIcon";
import { AVAILABILITY } from "../availability";
import Reveal from "./Reveal";

const panelButton =
  "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

/** Closing panel: a big invitation, the email with copy-to-clipboard, socials and the resume. */
export default function Contact() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.prompt("Copy my email address:", profile.email);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sage-700 via-sage-600 to-night-800 px-6 py-12 text-white shadow-xl dark:from-sage-600 dark:via-night-800 dark:to-night-900 sm:px-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">06 · Contact</p>
        <h2 id="contact-heading" className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Let&apos;s build something.
        </h2>
        <p className="mt-4 max-w-xl text-base text-white/85">{AVAILABILITY}. The fastest way to reach me is email.</p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <a href={`mailto:${profile.email}`} className={`${panelButton} bg-white text-sage-700 hover:bg-cream`}>
            <FaEnvelope size={14} aria-hidden="true" />
            {profile.email}
          </a>
          <button type="button" onClick={copy} className={`${panelButton} border border-white/40 bg-white/10 hover:bg-white/20`} aria-label="Copy email address">
            {copied ? <FaCheck size={13} aria-hidden="true" /> : <FaCopy size={13} aria-hidden="true" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Email address copied to the clipboard" : ""}
          </span>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {profile.links.map((link) => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${panelButton} border border-white/30 bg-white/10 hover:bg-white/20`}>
                <LinkIcon id={link.id} size={14} />
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a href={profile.resume} download className={`${panelButton} border border-white/30 bg-white/10 hover:bg-white/20`}>
              <FaDownload size={13} aria-hidden="true" /> Download resume
            </a>
          </li>
        </ul>

        {/* Toast */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-6 right-6 rounded-full bg-white px-4 py-2 text-sm font-medium text-sage-700 shadow-lg transition-all duration-300 motion-reduce:transition-none ${copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
        >
          Copied!
        </div>
      </Reveal>
    </section>
  );
}
