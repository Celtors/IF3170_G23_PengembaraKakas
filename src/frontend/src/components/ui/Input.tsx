import type { InputHTMLAttributes } from "react";
import "./FormControls.css";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={["ui-input", className].filter(Boolean).join(" ")} {...props} />;
}
