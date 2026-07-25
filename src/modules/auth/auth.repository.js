import { prisma } from "../../lib/prisma.js";

export async function findUserByEmail(email, client = prisma) {
  return client.user.findUnique({
    where: { email },
  });
}

export async function createUser(data, client = prisma) {
  return client.user.create({
    data,
  });
}

export async function findUserById(id, client = prisma) {
  return client.user.findUnique({
    where: { id },
  });
}