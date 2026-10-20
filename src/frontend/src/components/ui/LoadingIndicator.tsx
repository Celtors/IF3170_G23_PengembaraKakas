import "./LoadingIndicator.css";

interface LoadingIndicatorProps {
  label?: string;
  compact?: boolean;
}

export function LoadingIndicator({ label = "Loading…", compact = false }: LoadingIndicatorProps) {
  return (
    <span className={`ui-loading${compact ? " ui-loading--compact" : ""}`} role="status" aria-live="polite">
      <span className="ui-loading__spinner" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
