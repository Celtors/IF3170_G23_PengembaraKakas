import type { RunResponse } from "../types/visual";

const API_BASE_URL = "http://localhost:8000/api";

export async function runOptimization(payload: any): Promise<RunResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/run`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || "Terjadi kesalahan saat memanggil API");
        }

        const data: RunResponse = await response.json();
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}