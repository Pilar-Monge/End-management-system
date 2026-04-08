declare global {
  namespace Express {
    interface User {
      sub?: number;
      username?: string;
      role?: string;
      campId?: number;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
