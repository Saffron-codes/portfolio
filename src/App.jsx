import { lazy, Suspense } from "react";
import PlainView from "./plain/PlainView";
import { useTheme } from "./hooks/useTheme";
import { useViewMode } from "./hooks/useViewMode";
import { posterFor } from "./plain/posters";

// The desk (and its panels) only load when someone steps into it.
const DeskView = lazy(() => import("./DeskView"));

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { view, section, anchor, openDesk, closeDesk, openDeskSection, deskOverview, clearAnchor } = useViewMode();

  if (view === "desk") {
    return (
      <Suspense fallback={<img src={posterFor(theme)} alt="" aria-hidden="true" className="fixed inset-0 h-full w-full object-cover" />}>
        <DeskView
          theme={theme}
          onToggleTheme={toggleTheme}
          section={section}
          onOpenSection={openDeskSection}
          onDeskOverview={deskOverview}
          onBackToPortfolio={closeDesk}
        />
      </Suspense>
    );
  }
  return <PlainView theme={theme} onToggleTheme={toggleTheme} anchor={anchor} onClearAnchor={clearAnchor} onOpenDesk={openDesk} />;
}
