import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientType = ReturnType<typeof prismaClientSingleton>

declare global {
  var prisma: PrismaClientType | undefined
}

const prisma: PrismaClientType = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma