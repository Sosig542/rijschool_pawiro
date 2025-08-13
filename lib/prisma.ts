import pkg from "@prisma/client";

const { PrismaClient } = pkg as unknown as { PrismaClient: new () => any };

// Use a broad type to avoid type import issues from @prisma/client in certain TS configs
const globalForPrisma = global as unknown as { prisma?: any };

export const prisma: any = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
