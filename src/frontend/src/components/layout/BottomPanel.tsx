import type { ReactNode } from "react";

interface BottomPanelProps {
  collapsed: boolean;
  onToggle: () => void;
  onResizeStart: () => void;
  header: ReactNode;
  children: ReactNode;
}

/** Resizable results area. The parent owns sizing and active-tab state. */
export function BottomPanel({ collapsed, onToggle, onResizeStart, header, children }: BottomPanelProps) {
  return (
    <>
      <div className="resize-rail" onMouseDown={onResizeStart}>
        <button
          type="button"
          className="panel-toggle"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand bottom panel" : "Collapse bottom panel"}
          onClick={onToggle}
        >
          {collapsed ? "▲" : "▼"}
        </button>
      </div>
      <section className="bottom">
        {header}
        {!collapsed && <div className="panel-body">{children}</div>}
      </section>
    </>
  );
}
