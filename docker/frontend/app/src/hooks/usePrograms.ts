import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { ProgramSummary } from "../shared/types";

interface UseProgramsResult {
  programs: ProgramSummary[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export const usePrograms = (): UseProgramsResult => {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiRequest<ProgramSummary[]>("/programs");
      setPrograms(data);
    } catch (err) {
      console.error("Failed to load programs", err);
      setError("No fue posible cargar los programas académicos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPrograms();
  }, []);

  return {
    programs,
    isLoading,
    error,
    reload: loadPrograms,
  };
};
