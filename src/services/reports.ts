import { api, endpoints } from "../api";

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
  firstName?: string;
  last_name?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  cell?: string;
  phoneMobile?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  zip?: string;
  refcode?: string;
  loan_amount?: string | number;
  loanAmount?: string | number;
  requestedAmount?: string | number;
  clientEstimatedDebt?: string | number;
  dob?: string;
  ssn?: string;
  status?: string;
  source?: string;
  alt_source?: string;
  leadOrigin?: string;
  language?: string;
  hasTcpaConsent?: boolean;
  [key: string]: unknown;
}

export interface ApiLoanRecord {
  id?: string | number;
  lead_id?: string | number;
  created_at?: string;
  updated_at?: string;
  payload?: ApiLoanPayload;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  cell?: string;
  phoneMobile?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  zip?: string;
  refcode?: string;
  brand?: string;
  site_name?: string;
  loan_amount?: string | number;
  loanAmount?: string | number;
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
 * Standardized to use the centralized API client.
 */
export const reportService = {
  /**
   * Fetch loan submission report values with API key header and query parameters.
   */
  getValues: async (params: GetValuesParams = {}): Promise<GetValuesResponse> => {
    return await api.get<GetValuesResponse, GetValuesParams>(endpoints.reports.getValues, {
      params,
      headers: {
        "x-api-key": API_KEY_HEADER,
      },
    });
  },
};

