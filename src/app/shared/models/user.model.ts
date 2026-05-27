export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password?: string;
  createdAt?: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
}