import axios from "axios";
import type { CaseComparison, Transaction } from "../types/apiTypes";

const API_URL = "http://localhost:5000/api";

export const useAML = () => {
  const uploadCase = async (file: File) => {
    const formData = new FormData();
    formData.append("csvFile", file);
    const { data } = await axios.post<{ caseId: string }>(
      `${API_URL}/cases/upload/plugin`,
      formData
    );
    return data.caseId;
  };

  const compareCases = async (case1Id: string, case2Id: string) => {
    const { data } = await axios.get<CaseComparison>(
      `${API_URL}/cases/compare/${case1Id}/${case2Id}`
    );
    return data;
  };

  return { uploadCase, compareCases };
};
