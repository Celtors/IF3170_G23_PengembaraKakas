import { useState, useCallback } from 'react';
import { runOptimization } from '../services/api';
import type { RunResponse } from '../types/visual';

export function useOptimization() {
    const [data, setData] = useState<RunResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const executeRun = useCallback(async (payload: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await runOptimization(payload);
            setData(result);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Terjadi kesalahan saat menjalankan optimasi.';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        data,
        isLoading,
        error,
        executeRun,
        clearData: () => setData(null),
    };
}