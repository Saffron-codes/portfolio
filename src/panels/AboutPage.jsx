import { FaDownload, FaEnvelope, FaLocationDot } from "react-icons/fa6";
import profile from "../data/profile";
import { primaryButton, secondaryButton } from "./panelStyles";

export const ABOUT_DESIGN = { width: 480, height: 699 };

/** Rendered on the open notebook page. */
export default function AboutPage({ onBackToPortfolio }) {
  return (
    <div
      className="flex h-full min-h-full w-full flex-col px-7 py-8 text-ink"
      style={{
        backgroundColor: "#f6efe0",
        backgroundImage: "repeating-linear-gradient(transparent 0 27px, rgba(80,60,40,0.14) 27px 28px)",
      }}
    >
      <h2 className="text-3xl font-bold leading-7">{profile.name}</h2>
      <p className="mt-1 text-lg font-medium leading-7 text-sage-700">{profile.title}</p>
      <p className="flex items-center gap-1.5 text-sm leading-7 text-ink/70">
        <FaLocationDot size={12} aria-hidden="true" /> {profile.location}
      </p>
      <p className="mt-5 text-[15px] leading-7 text-ink/80">{profile.bio}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <a href={`mailto:${profile.email}`} className={primaryButton}>
          <FaEnvelope size={13} aria-hidden="true" /> Email
        </a>
        <a href={profile.resume} download className={secondaryButton}>
          <FaDownload size={13} aria-hidden="true" /> Resume
        </a>
        <button type="button" onClick={onBackToPortfolio} className={secondaryButton}>
          Back to portfolio
        </button>
      </div>
    </div>
  );
}
