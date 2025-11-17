import api from "../../lib/axios";
import type {
  LoginRequest,
  SignUpRequest,
  AuthResponse,
  UserType,
  SignUpResponse,
} from "../../types/UserType";

export class AuthService {
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/users/login", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async signup(data: SignUpRequest): Promise<SignUpResponse> {
    try {
      const response = await api.post<SignUpResponse>("/users/signup", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post("/users/logout");
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser(): Promise<UserType> {
    try {
      const response = await api.get<{ user: UserType }>("/users/me");
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/users/refresh");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
