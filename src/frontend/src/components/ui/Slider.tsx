import type { InputHTMLAttributes } from "react";
import "./FormControls.css";

type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Slider({ className = "", ...props }: SliderProps) {
  return <input type="range" className={["ui-slider", className].filter(Boolean).join(" ")} {...props} />;
}
