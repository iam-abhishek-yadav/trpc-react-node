import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export function createContext() {
  return {
    isAdmin: true,
  };
}
