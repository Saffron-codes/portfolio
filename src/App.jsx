import PlainView from "./plain/PlainView";
import DeskView from "./DeskView";
import { useTheme } from "./hooks/useTheme";
import { usePlainMode } from "./hooks/usePlainMode";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { isPlain, setPlain } = usePlainMode();

  if (isPlain) {
    return <PlainView theme={theme} onToggleTheme={toggleTheme} onExitPlain={() => setPlain(false)} />;
  }
  return <DeskView theme={theme} onToggleTheme={toggleTheme} onShowPlain={() => setPlain(true)} />;
}
