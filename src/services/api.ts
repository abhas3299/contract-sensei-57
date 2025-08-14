import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
});

export interface ContractResponse {
  id: string;
  filename: string;
  status: string;
  upload_date: string;
  risk_score?: number;
}

export interface ClauseResponse {
  id: string;
  type: string;
  content: string;
  risk_level: string;
  explanation: string;
  suggestion?: string;
}

export interface AnalysisResponse {
  contract_id: string;
  risk_score: number;
  summary: string;
  clauses: ClauseResponse[];
  status: string;
}

export const contractAPI = {
  // Upload a contract file
  uploadContract: async (file: File): Promise<ContractResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Analyze a contract
  analyzeContract: async (contractId: string): Promise<AnalysisResponse> => {
    const response = await api.post(`/analyze/${contractId}`);
    return response.data;
  },

  // Get analysis results
  getAnalysisResult: async (contractId: string): Promise<AnalysisResponse> => {
    const response = await api.get(`/result/${contractId}`);
    return response.data;
  },

  // Download analysis report
  downloadReport: async (contractId: string): Promise<Blob> => {
    const response = await api.get(`/download/${contractId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // List all contracts
  listContracts: async (): Promise<ContractResponse[]> => {
    const response = await api.get('/contracts');
    return response.data;
  },
};

export default api;