import type { ValidationIssue } from "../types";

/** Ambil issue untuk sebuah field; error diprioritaskan di atas warning. */
export function findIssue(
    issues: ValidationIssue[],
    field: ValidationIssue["field"],
): ValidationIssue | undefined {
    return (
        issues.find((i) => i.field === field && i.severity === "error") ??
        issues.find((i) => i.field === field)
    );
}
