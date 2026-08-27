import axios from "axios";
import { endpoints } from "../api";

export const API_KEY_HEADER = "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p";

export interface GetValuesParams {
  site_name?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface ApiLoanPayload {
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  cell?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  refcode?: string;
  loan_amount?: string | number;
  dob?: string;
  ssn?: string;
  status?: string;
  [key: string]: unknown;
}

export interface ApiLoanRecord {
  id?: string | number;
  lead_id?: string | number;
  created_at?: string;
  updated_at?: string;
  payload?: ApiLoanPayload;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  cell?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  refcode?: string;
  brand?: string;
  site_name?: string;
  loan_amount?: string | number;
  status?: string;
  date?: string;
  [key: string]: unknown;
}

export interface GetValuesResponse {
  status?: string | boolean | number;
  success?: boolean;
  message?: string;
  total?: number;
  total_count?: number;
  page?: number;
  limit?: number;
  data?: ApiLoanRecord[];
  results?: ApiLoanRecord[];
  records?: ApiLoanRecord[];
  values?: ApiLoanRecord[];
  [key: string]: unknown;
}

/**
 * Service for fetching loan and application values from the backend API.
 */
export const reportService = {
  /**
   * Fetch loan submission report values with API key header and query parameters.
   */
  getValues: async (params: GetValuesParams = {}): Promise<GetValuesResponse> => {
    const response = await axios.get<GetValuesResponse>(endpoints.reports.getValues, {
      params,
      headers: {
        "x-api-key": API_KEY_HEADER,
      },
    });
    return response.data;
  },
};
