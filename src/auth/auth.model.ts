export interface LoginDTO {
  username: string;
  password: string;
  campId: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    rol: string;
    role: string;
    campId: number;
    personId: number | null;
    status: string;
  };
}

export interface JwtPayload {
  userId: number;
  campId: number;
  rol: string;
}

export interface SessionValidationOptions {
  updateLastActivity?: boolean;
}
