import type { SelectHTMLAttributes } from "react";
import "./FormControls.css";

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={["ui-select", className].filter(Boolean).join(" ")} {...props}>{children}</select>;
}
