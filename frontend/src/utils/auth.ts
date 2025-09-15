import {jwtDecode} from "jwt-decode";

const TOKEN_KEY = "pdf_annotator_token";

export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const isLoggedIn = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp * 1000;
    return Date.now() < exp;
  } catch {
    return false;
  }
};

// Get user ID from token
export const getUserId = (): string | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.id;
  } catch {
    return null;
  }
};

// Get full user payload (id + email)
export const getTokenPayload = (): { id: string; email: string } | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return { id: decoded.id, email: decoded.email };
  } catch {
    return null;
  }
};
