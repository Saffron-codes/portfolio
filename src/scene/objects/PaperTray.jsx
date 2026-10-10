/** Paper tray with the printed resume on top (direct download later). Size: 180 × 70. */
export const TRAY_SIZE = { width: 180, height: 70 };

export default function PaperTray(props) {
  return (
    <g {...props}>
      <rect x="4" y="12" width="180" height="62" rx="6" fill="var(--sc-shadow)" />
      {/* Back wall of the tray */}
      <rect x="0" y="0" width="180" height="26" rx="5" fill="var(--sc-device-dark)" opacity="0.9" />
      {/* Paper stack */}
      <rect x="14" y="14" width="152" height="40" rx="2" fill="var(--sc-paper-line)" />
      <rect x="12" y="11" width="156" height="40" rx="2" fill="var(--sc-paper)" />
      {/* Top sheet: resume */}
      <rect x="24" y="19" width="44" height="6" rx="3" fill="var(--sc-accent)" opacity="0.85" />
      <rect x="24" y="29" width="98" height="3" rx="1.5" fill="var(--sc-paper-line)" />
      <rect x="24" y="35" width="84" height="3" rx="1.5" fill="var(--sc-paper-line)" />
      <rect x="24" y="41" width="110" height="3" rx="1.5" fill="var(--sc-paper-line)" />
      <circle cx="146" cy="26" r="7" fill="var(--sc-amber)" opacity="0.9" />
      {/* Front wall of the tray */}
      <rect x="0" y="44" width="180" height="26" rx="5" fill="var(--sc-device-dark)" />
      <rect x="0" y="44" width="180" height="4" rx="2" fill="var(--sc-highlight)" opacity="0.6" />
      <rect x="70" y="52" width="40" height="8" rx="4" fill="var(--sc-device-2)" opacity="0.7" />
    </g>
  );
}
