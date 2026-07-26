import { prisma } from "../../lib/prisma.js";

export async function updateUser(id, data, client = prisma) {
  return client.user.update({
    where: { id },
    data,
  });
}