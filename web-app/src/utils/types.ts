// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Service Category types
export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

// Service Provider types
export interface ServiceProvider {
  id: number;
  name: string;
  phone: string;
  line_id?: string;
  service_category_id: number;
  category_name?: string;
  category_icon?: string;
  location: string;
  district: string;
  subdistrict: string;
  province: string;
  description?: string;
  price_range?: string;
  available_days?: string;
  available_hours?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  bank_name?: string;
  rating: number;
  total_jobs: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  recent_jobs?: JobMatch[];
}

// Customer types
export interface Customer {
  id: number;
  name: string;
  phone: string;
  line_id?: string;
  location: string;
  district: string;
  subdistrict: string;
  province: string;
  service_category_id: number;
  category_name?: string;
  category_icon?: string;
  job_description: string;
  budget_range?: string;
  preferred_date?: string;
  preferred_time?: string;
  urgency_level: 'low' | 'medium' | 'high';
  preferred_contact: 'phone' | 'line' | 'both';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  job_matches?: JobMatch[];
}

// Job Match types
export interface JobMatch {
  id: number;
  provider_id: number;
  provider_name?: string;
  provider_phone?: string;
  provider_line_id?: string;
  provider_rating?: number;
  provider_price_range?: string;
  provider_location?: string;
  provider_district?: string;
  provider_subdistrict?: string;
  provider_available_days?: string;
  provider_available_hours?: string;
  customer_id: number;
  customer_name?: string;
  customer_phone?: string;
  customer_line_id?: string;
  customer_location?: string;
  customer_district?: string;
  customer_subdistrict?: string;
  customer_preferred_date?: string;
  customer_preferred_time?: string;
  job_description?: string;
  budget_range?: string;
  urgency_level?: 'low' | 'medium' | 'high';
  preferred_contact?: 'phone' | 'line' | 'both';
  category_name?: string;
  category_icon?: string;
  match_score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  provider_response?: string;
  customer_response?: string;
  rating?: number;
  feedback?: string;
  match_date: string;
  response_date?: string;
  completion_date?: string;
  history?: MatchHistory[];
}

// Match History types
export interface MatchHistory {
  id: number;
  match_id: number;
  action: string;
  description: string;
  timestamp: string;
}

// Match Statistics types
export interface MatchStats {
  total_matches: number;
  pending_matches: number;
  accepted_matches: number;
  completed_matches: number;
  rejected_matches: number;
  avg_match_score: number;
  avg_rating: number;
  top_categories: {
    name: string;
    icon: string;
    match_count: number;
  }[];
}

// Form types
export interface ProviderFormData {
  name: string;
  phone: string;
  line_id?: string;
  service_category_id: number;
  location: string;
  district: string;
  subdistrict: string;
  province: string;
  description?: string;
  price_range?: string;
  available_days?: string;
  available_hours?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  bank_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
  is_active: boolean;
}

export interface ProviderFormErrors {
  name?: string;
  phone?: string;
  line_id?: string;
  service_category_id?: string;
  location?: string;
  district?: string;
  subdistrict?: string;
  province?: string;
  description?: string;
  price_range?: string;
  available_days?: string;
  available_hours?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  bank_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
  is_active?: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  line_id?: string;
  location: string;
  district: string;
  subdistrict: string;
  province: string;
  service_category_id: number;
  job_description: string;
  budget_range?: string;
  preferred_date?: string;
  preferred_time?: string;
  urgency_level: 'low' | 'medium' | 'high';
  preferred_contact: 'phone' | 'line' | 'both';
  is_active: boolean;
}

export interface CustomerFormErrors {
  name?: string;
  phone?: string;
  line_id?: string;
  location?: string;
  district?: string;
  subdistrict?: string;
  province?: string;
  service_category_id?: string;
  job_description?: string;
  budget_range?: string;
  preferred_date?: string;
  preferred_time?: string;
  urgency_level?: string;
  preferred_contact?: string;
  is_active?: string;
}

export interface MatchStatusUpdateData {
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  provider_response?: string;
  customer_response?: string;
  rating?: number;
  feedback?: string;
}

// Filter types
export interface ProviderFilters {
  category_id?: number;
  district?: string;
  subdistrict?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'rating' | 'total_jobs' | 'created_at';
  order?: 'ASC' | 'DESC';
}

export interface CustomerFilters {
  category_id?: number;
  district?: string;
  subdistrict?: string;
  urgency_level?: 'low' | 'medium' | 'high';
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'created_at' | 'urgency_level';
  order?: 'ASC' | 'DESC';
}

export interface MatchFilters {
  provider_id?: number;
  customer_id?: number;
  status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  page?: number;
  limit?: number;
  sort_by?: 'match_date' | 'match_score' | 'response_date';
  order?: 'ASC' | 'DESC';
}

// Notification types
export interface Notification {
  id: number;
  user_type: 'provider' | 'customer';
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

// Authentication types
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// UI Component types
export interface Option {
  value: string | number;
  label: string;
  icon?: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Districts and Subdistricts in Ratchaburi
export const DISTRICTS = [
  'เมืองราชบุรี',
  'จอมบึง',
  'สวนผึ้ง',
  'ดำเนินสะดวก',
  'บ้านโป่ง',
  'บางแพ',
  'โพธาราม',
  'ปากท่อ',
  'วัดเพลง',
  'บ้านคา'
];

export const SUBDISTRICTS: Record<string, string[]> = {
  'ดำเนินสะดวก': [
    'ดำเนินสะดวก',
    'แพงพวย',
    'ศิลาอาสน์',
    'ดอนตาเพชร',
    'ขุนพิทักษ์',
    'ท่าข้าม',
    'ดอนคลัง'
  ],
  'เมืองราชบุรี': [
    'หน้าเมือง',
    'ปากท่อ',
    'คูบัว',
    'ท่าช้าง',
    'หอรัตน์',
    'ราชบุรี',
    'ท่าเรือ'
  ],
  // Add more districts and subdistricts as needed
};

export const URGENCY_LEVELS = [
  { value: 'low', label: 'ไม่เร่งด่วน', color: 'green' },
  { value: 'medium', label: 'ปานกลาง', color: 'yellow' },
  { value: 'high', label: 'เร่งด่วน', color: 'red' }
];

export const CONTACT_METHODS = [
  { value: 'phone', label: 'โทรศัพท์' },
  { value: 'line', label: 'LINE' },
  { value: 'both', label: 'ทั้งสองช่องทาง' }
];

export const MATCH_STATUSES = [
  { value: 'pending', label: 'รอการตอบกลับ', color: 'yellow' },
  { value: 'accepted', label: 'ตอบรับแล้ว', color: 'blue' },
  { value: 'rejected', label: 'ปฏิเสธ', color: 'red' },
  { value: 'completed', label: 'สำเร็จ', color: 'green' },
  { value: 'cancelled', label: 'ยกเลิก', color: 'gray' }
];