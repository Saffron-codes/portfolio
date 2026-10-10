import PlainView from "./plain/PlainView";
import DeskView from "./DeskView";
import { useTheme } from "./hooks/useTheme";
import { useViewMode } from "./hooks/useViewMode";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { view, section, anchor, openDesk, closeDesk, openDeskSection, deskOverview, clearAnchor } = useViewMode();

  if (view === "desk") {
    return (
      <DeskView
        theme={theme}
        onToggleTheme={toggleTheme}
        section={section}
        onOpenSection={openDeskSection}
        onDeskOverview={deskOverview}
        onBackToPortfolio={closeDesk}
      />
    );
  }
  return <PlainView theme={theme} onToggleTheme={toggleTheme} anchor={anchor} onClearAnchor={clearAnchor} onOpenDesk={openDesk} />;
}
