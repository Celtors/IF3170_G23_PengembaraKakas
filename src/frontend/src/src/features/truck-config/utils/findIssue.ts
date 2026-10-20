import type { ConfigIssue } from "../types";

export function findIssue(issues: ConfigIssue[], path: string): ConfigIssue | undefined {
    return (
        issues.find((i) => i.path === path && i.severity === "error") ??
        issues.find((i) => i.path === path)
    );
}

export function findFirstIssue(issues: ConfigIssue[], paths: string[]): ConfigIssue | undefined {
    for (const path of paths) {
        const found = findIssue(issues, path);
        if (found) return found;
    }
    return undefined;
}

export function hasIssueUnder(
    issues: ConfigIssue[],
    prefix: string,
    severity: ConfigIssue["severity"] = "error",
): boolean {
    return issues.some((i) => i.path.startsWith(prefix) && i.severity === severity);
}
