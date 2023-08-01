export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  location: string;
  pic: File | null;
}
export interface LoginData {
  email: string;
  password: string;
}
