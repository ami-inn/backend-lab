import {PrismaPg} from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';



const connectionString = process.env.DATABASE_URL

const globalForPrisma = global as unknown as { prisma: PrismaClient };

if(!globalForPrisma.prisma) {
  const adapter = new PrismaPg({connectionString})

  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
  });
}

export const prisma = globalForPrisma.prisma;