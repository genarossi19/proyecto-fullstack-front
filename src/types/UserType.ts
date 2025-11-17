export interface UserType {
  id: number;
  name: string;
  lastname: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: UserType;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface SignUpResponse extends UserType {
  // La respuesta de signup devuelve directamente el usuario sin envolver en {user: ...}
}
