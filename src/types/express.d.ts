declare global {
  namespace Express {
    interface User {
      userId?: number;
      campId?: number;
      rol?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
