import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaLink } from "react-icons/fa6";

const ICONS = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  x: FaXTwitter,
  instagram: FaInstagram,
};

/** Icon for a social link id from profile.links. Decorative; pair it with visible text or an aria-label. */
export default function LinkIcon({ id, size = 16, className }) {
  const Icon = ICONS[id] ?? FaLink;
  return <Icon size={size} className={className} aria-hidden="true" focusable="false" />;
}
