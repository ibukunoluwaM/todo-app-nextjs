import { PrismaClient } from "@prisma/client";
// import {PrismaClient}
const globalForPrisma = global as unknown as { prisma: PrismaClient };


export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ["query"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// async function test() {
//   const users = await prisma.user.findMany();
//   console.log(users);
// }
// test();