declare global {
  namespace App {
    interface Locals {
      user?: {
        uid: string;
        email: string | null;
      };
    }
  }
}

export {};