import Monitor from "./Monitor";
import Laptop from "./Laptop";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import PenHolder from "./PenHolder";
import SteelTin from "./SteelTin";
import GlassesCase from "./GlassesCase";
import EarbudsCase from "./EarbudsCase";
import Phone from "./Phone";
import Notebook from "./Notebook";
import Deskpulse from "./Deskpulse";
import Certificate from "./Certificate";
import ResumeSheet from "./ResumeSheet";
import Switchboard from "./Switchboard";
import Chair from "./Chair";

/** name → component. Any entry can later be swapped for a .glb-backed component with the same name. */
export const OBJECT_COMPONENTS = {
  monitor: Monitor,
  laptop: Laptop,
  keyboard: Keyboard,
  mouse: Mouse,
  penHolder: PenHolder,
  steelTin: SteelTin,
  glassesCase: GlassesCase,
  earbudsCase: EarbudsCase,
  phone: Phone,
  notebook: Notebook,
  deskpulse: Deskpulse,
  certificate: Certificate,
  resumeSheet: ResumeSheet,
  switchboard: Switchboard,
  chair: Chair,
};
