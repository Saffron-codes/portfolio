import profile from "../data/profile";
import { layout, VIEWBOX } from "./layout";
import { Wall, Desk } from "./objects/Room";
import Window from "./objects/Window";
import Cat from "./objects/Cat";
import NeonSign from "./objects/NeonSign";
import Certificate from "./objects/Certificate";
import Lamp from "./objects/Lamp";
import Laptop from "./objects/Laptop";
import Monitor from "./objects/Monitor";
import Phone from "./objects/Phone";
import Deskpulse from "./objects/Deskpulse";
import Plant from "./objects/Plant";
import Notebook from "./objects/Notebook";
import Keyboard from "./objects/Keyboard";
import Mouse from "./objects/Mouse";
import Mug from "./objects/Mug";
import PaperTray from "./objects/PaperTray";

const at = (key) => ({ transform: `translate(${layout[key].x} ${layout[key].y})` });

/**
 * The whole room in one SVG coordinate space (1600 × 900), scaled to cover the viewport.
 * The wall and floor extend well beyond 0–900 so a taller viewBox (narrow viewports) still looks right.
 * Objects are drawn back to front. Colours come from --sc-* CSS variables (light/dark).
 */
export default function Scene({ sky = "day", viewBox = `0 0 ${VIEWBOX.width} ${VIEWBOX.height}`, className = "" }) {
  return (
    <svg
      className={`scene ${className}`}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Illustration of ${profile.name}'s desk: a monitor, laptop, keyboard and phone in a cozy room with a big window.`}
    >
      <Wall />

      {/* Wall objects */}
      <Window sky={sky} {...at("window")} />
      <Cat {...at("cat")} />
      <NeonSign name={profile.name} title={profile.title} {...at("neonSign")} />
      <Certificate {...at("certificate")} />

      <Desk />

      {/* Back row */}
      <Lamp {...at("lamp")} />
      <Laptop {...at("laptop")} />
      <Monitor {...at("monitor")} />
      <Phone {...at("phone")} />
      <Deskpulse {...at("deskpulse")} />
      <Plant {...at("plant")} />

      {/* Front row */}
      <Notebook {...at("notebook")} />
      <Keyboard {...at("keyboard")} />
      <Mouse {...at("mouse")} />
      <Mug {...at("mug")} />
      <PaperTray {...at("paperTray")} />
    </svg>
  );
}
