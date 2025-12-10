import { User } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      name: string;
      email: string;
      password: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
