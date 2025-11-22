import { apiRequest } from "./base";

export interface CsvUploadResponse {
  message: string;
  registered_count: number;
  failed?: Array<{
    row: number;
    error: string;
  }>;
}

export interface CsvValidationResponse {
  valid: boolean;
  errors?: string[];
  preview?: Array<Record<string, any>>;
}

export interface CsvRegistrationStatus {
  club_id: string;
  club_name: string;
  total_uploaded: number;
  total_registered: number;
  pending: number;
  last_upload: string;
}

export const csvApi = {
  registerPlayers: (file: File, clubId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("club_id", clubId);

    return fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api/csv/register-players`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(error.message);
      }
      return response.json() as Promise<CsvUploadResponse>;
    });
  },

  validateCsv: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api/csv/validate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Validation failed" }));
        throw new Error(error.message);
      }
      return response.json() as Promise<CsvValidationResponse>;
    });
  },

  downloadTemplate: () => {
    const url = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api/csv/upload-template`;
    window.open(url, "_blank");
  },

  getRegistrationStatus: (clubId: string) =>
    apiRequest<CsvRegistrationStatus>(`/api/csv/registration-status/${clubId}`, "GET", null, true),
};
