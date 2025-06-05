export interface User {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role_id: number;
  address: string;
  bio: string;
  photo: string | null;
  otp_code: string | null;
  otp_expires_at: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
