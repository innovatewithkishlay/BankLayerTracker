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
      let errorMessage = "Upload failed. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.required) {
          errorMessage += `\nRequired columns: ${error.response.data.required.join(
            ", "
          )}`;
        }
      }

      throw new Error(errorMessage);
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
