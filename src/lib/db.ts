// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PrismaClientClass: any
try {
  // PrismaClient requires `prisma generate` to be run first
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PrismaClientClass = require('@prisma/client').PrismaClient
} catch {
  PrismaClientClass = null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma: any = PrismaClientClass
  ? (globalForPrisma.prisma ?? new PrismaClientClass())
  : null

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma
