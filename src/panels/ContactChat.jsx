import { FaDownload, FaEnvelope, FaPaperPlane } from "react-icons/fa6";
import profile from "../data/profile";
import LinkIcon from "../components/LinkIcon";

export const CONTACT_DESIGN = { width: 414, height: 912 };

const chip =
  "inline-flex items-center gap-2 rounded-full border border-sage-600/50 bg-white px-4 py-2 text-base font-medium text-sage-700 hover:bg-sage-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500";

/** Rendered on the phone: a Material-style chat with quick-reply links. */
export default function ContactChat() {
  return (
    <div className="flex h-full w-full flex-col bg-[#eef3f1] text-ink">
      <div className="flex items-center gap-3 bg-sage-600 px-5 pb-4 pt-8 text-white shadow">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 text-xl font-semibold" aria-hidden="true">
          S
        </div>
        <div>
          <p className="text-lg font-semibold leading-tight">Saffron</p>
          <p className="text-sm text-white/80">online · Chennai</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-lg shadow-sm">Hey! 👋 Want to work together?</div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-lg shadow-sm">
          Pick a channel and I&apos;ll get back to you quickly.
        </div>
        <div className="mt-1 flex flex-wrap gap-2" aria-label="Quick replies">
          <a href={`mailto:${profile.email}`} className={chip}>
            <FaEnvelope size={15} aria-hidden="true" /> Email
          </a>
          {profile.links.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={chip}>
              <LinkIcon id={link.id} size={15} /> {link.label}
            </a>
          ))}
          <a href={profile.resume} download className={chip}>
            <FaDownload size={15} aria-hidden="true" /> Resume
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-ink/10 bg-white px-3 py-2">
        <div className="flex-1 rounded-full bg-[#eef3f1] px-4 py-2.5 text-base text-ink/50">Message</div>
        <a href={`mailto:${profile.email}`} aria-label="Send me an email" className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-600 text-white">
          <FaPaperPlane size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
