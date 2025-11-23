import { supabase } from "@/integrations/supabase/client";
import { playerApi } from "./playerApi";

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

const parseCSV = (text: string): Record<string, string>[] => {
  const lines = text.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string, string> = {};
    const currentline = lines[i].split(",");

    if (currentline.length === headers.length) {
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j].trim();
      }
      result.push(obj);
    }
  }
  return result;
};

export const csvApi = {
  registerPlayers: async (file: File, clubId: string) => {
    const text = await file.text();
    const data = parseCSV(text);
    const failed: { row: number; error: string }[] = [];
    let registeredCount = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Map CSV columns to RegisterPlayerPayload
        // Assuming CSV headers: name, age, phone, gender, events (comma separated)
        await playerApi.registerPlayer({
          player_name: row.name,
          age: parseInt(row.age),
          phone: row.phone,
          club_name: row.club || "Unknown", // Or fetch club name using clubId
          gender: (row.gender?.toLowerCase() as "male" | "female") || "male",
          events: row.events ? row.events.split("|") : [], // Assuming pipe separated for array
        });
        registeredCount++;
      } catch (error: any) {
        failed.push({ row: i + 2, error: error.message });
      }
    }

    return {
      message: "Upload processed",
      registered_count: registeredCount,
      failed,
    } as CsvUploadResponse;
  },

  validateCsv: async (file: File) => {
    const text = await file.text();
    const data = parseCSV(text);
    const errors: string[] = [];

    // Simple validation: check if required fields exist
    const requiredFields = ["name", "age", "phone", "gender"];
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      requiredFields.forEach((field) => {
        if (!headers.includes(field)) {
          errors.push(`Missing column: ${field}`);
        }
      });
    } else {
      errors.push("Empty file or invalid format");
    }

    return {
      valid: errors.length === 0,
      errors,
      preview: data.slice(0, 5),
    } as CsvValidationResponse;
  },

  downloadTemplate: () => {
    const headers = "name,age,phone,gender,club,events";
    const blob = new Blob([headers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "player_registration_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  },

  getRegistrationStatus: async (clubId: string) => {
    // Since we process synchronously in frontend, there is no pending status.
    // We can return current counts from DB.
    const { count } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })
      .eq("club", clubId); // Assuming clubId is stored in 'club' column (which is string name in playerApi, might need adjustment)

    return {
      club_id: clubId,
      club_name: "Unknown", // Need to fetch club details
      total_uploaded: 0, // Not tracked
      total_registered: count || 0,
      pending: 0,
      last_upload: new Date().toISOString(),
    } as CsvRegistrationStatus;
  },
};
