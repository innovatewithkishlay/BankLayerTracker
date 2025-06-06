import axios from "axios";
import type { CaseComparison, Transaction } from "../types/apiTypes";

const API_URL = "http://localhost:5000/api";

export const useAML = () => {
  const uploadCase = async (
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const { data } = await axios.post<{ caseId: string }>(
        `${API_URL}/cases/upload/plugin`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            onProgress?.(percent);
          },
        }
      );
      return data.caseId;
    } catch (error: any) {
      let errorMessage = "Upload failed. Please check your CSV file format.";
      const details: string[] = [];

      if (error.response?.data) {
        // Handle backend validation errors
        if (error.response.data.error?.includes("missing required columns")) {
          errorMessage = "Missing required columns in CSV file";
          details.push(
            "🔍 Required columns:",
            "• fromAccount (Source Account)",
            "• toAccount (Destination Account)",
            "• amount (Transaction Amount)",
            "• date (Transaction Date)"
          );
        }

        if (error.response.data.details) {
          details.push("⚠️ Found issues:", ...error.response.data.details);
        }
      }

      const err = new Error(errorMessage);
      (err as any).details = details;
      throw err;
    }
  };

  const compareCases = async (case1Id: string, case2Id: string) => {
    const { data } = await axios.get<CaseComparison>(
      `${API_URL}/cases/compare/${case1Id}/${case2Id}`
    );
    return data;
  };

  const getCase = async (caseId: string) => {
    const { data } = await axios.get(`${API_URL}/cases/${caseId}`);
    return data;
  };

  return { uploadCase, compareCases, getCase };
};
