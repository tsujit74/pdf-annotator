import api from "./api";

interface AuthResponse {
  token: string;
}

export const signup = async (email: string, password: string) => {
  const res = await api.post<AuthResponse>("/auth/signup", { email, password });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post<AuthResponse>("/auth/login", { email, password });
  return res.data;
};
