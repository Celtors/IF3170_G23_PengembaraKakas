import type { ReactNode } from "react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function Sidebar({ collapsed, onToggle, children }: SidebarProps) {
  return (
    <aside className="left">
      <div className="panel-header">
        {!collapsed && <span className="panel-title">Configuration</span>}
        <button
          type="button"
          className="panel-toggle"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand left panel" : "Collapse left panel"}
          onClick={onToggle}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>
      {!collapsed && <div className="panel-body">{children}</div>}
    </aside>
  );
}
