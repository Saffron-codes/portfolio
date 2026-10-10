import PlainView from "./plain/PlainView";
import SceneView from "./scene/SceneView";
import { useTheme } from "./hooks/useTheme";
import { usePlainMode } from "./hooks/usePlainMode";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { isPlain, setPlain } = usePlainMode();

  if (isPlain) {
    return <PlainView theme={theme} onToggleTheme={toggleTheme} onExitPlain={() => setPlain(false)} />;
  }
  return <SceneView theme={theme} onToggleTheme={toggleTheme} onShowPlain={() => setPlain(true)} />;
}
