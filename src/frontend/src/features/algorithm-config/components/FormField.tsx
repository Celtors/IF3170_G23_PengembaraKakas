import type { ReactNode } from "react";
import type { ValidationIssue } from "../types";
import "./FormField.css";

interface FormFieldProps {
    label: string;
    hint?: string;
    issue?: ValidationIssue;
    /** true: bungkus beberapa input dalam <fieldset> (mis. 3 variasi GA) */
    group?: boolean;
    children: ReactNode;
}

export function FormField({ label, hint, issue, group = false, children }: FormFieldProps) {
    const className = ["form-field", issue ? `form-field--${issue.severity}` : ""]
        .filter(Boolean)
        .join(" ");

    const body = (
        <>
            {children}
            {hint && <small className="form-field__hint">{hint}</small>}
            {issue && (
                <small
                    className={`form-field__issue form-field__issue--${issue.severity}`}
                    role={issue.severity === "error" ? "alert" : undefined}
                >
                    {issue.message}
                </small>
            )}
        </>
    );

    if (group) {
        return (
            <fieldset className={className}>
                <legend className="form-field__label">{label}</legend>
                {body}
            </fieldset>
        );
    }

    return (
        <label className={className}>
            <span className="form-field__label">{label}</span>
            {body}
        </label>
    );
}
