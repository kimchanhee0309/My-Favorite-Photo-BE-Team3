import { prisma } from "../../lib/prisma.js";

const includeDetail = {
  user: {
    select: {
      id: true,
      nickname: true,
    },
  },
  ownership: {
    include: {
      photocard: true,
    },
  },
};

export async function getAllShopListings() {
  return prisma.shopListing.findMany({
    where: { status: { not: "CANCELLED" } },
    include: { ownership: { include: { photocard: true } } },
  });
}

export async function getAllMyShopListings(userId) {
  return prisma.shopListing.findMany({
    where: { userId, status: { not: "CANCELLED" } },
    include: { ownership: { include: { photocard: true } }, exchanges: true },
  });
}

export async function countShopListings(where, client = prisma) {
  return client.shopListing.count({ where });
}

export async function findShopListings(
  { where, orderBy, take, includeExchanges = false },
  client = prisma,
) {
  return client.shopListing.findMany({
    where,
    orderBy,
    take,
    include: { ...includeDetail, ...(includeExchanges && { exchanges: true }) },
  });
}

export async function findShopListingById(shopListingId, client = prisma) {
  return client.shopListing.findUnique({
    where: { id: shopListingId },
    include: {
      ...includeDetail,
      exchanges: {
        include: {
          proposer: {
            select: {
              id: true,
              nickname: true,
            },
          },
          photocard: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function findOwnershipById(ownershipId, client = prisma) {
  return client.ownership.findUnique({
    where: { id: ownershipId },
    include: {
      photocard: true,
    },
  });
}

export async function createShopListing(data, client = prisma) {
  return client.shopListing.create({
    data,
    include: includeDetail,
  });
}

export async function updateShopListing(shopListingId, data, client = prisma) {
  return client.shopListing.update({
    where: { id: shopListingId },
    data,
    include: includeDetail,
  });
}

export async function decreaseOwnershipQuantity(
  ownershipId,
  quantity,
  client = prisma,
) {
  return client.ownership.update({
    where: { id: ownershipId },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  });
}

export async function increaseOwnershipQuantity(
  ownershipId,
  quantity,
  client = prisma,
) {
  return client.ownership.update({
    where: { id: ownershipId },
    data: {
      quantity: {
        increment: quantity,
      },
    },
  });
}

export async function findUserById(userId, client = prisma) {
  return client.user.findUnique({
    where: { id: userId },
  });
}

export async function decreaseUserPoints(userId, points, client = prisma) {
  return client.user.update({
    where: { id: userId },
    data: {
      points: {
        decrement: points,
      },
    },
  });
}

export async function increaseUserPoints(userId, points, client = prisma) {
  return client.user.update({
    where: { id: userId },
    data: {
      points: {
        increment: points,
      },
    },
  });
}

export async function upsertOwnership(
  { userId, photocardId, quantity },
  client = prisma,
) {
  return client.ownership.upsert({
    where: {
      userId_photocardId: {
        userId,
        photocardId,
      },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      userId,
      photocardId,
      quantity,
    },
  });
}

export async function findShopListingExchanges(shopListingId, client = prisma) {
  return client.exchange.findMany({
    where: {
      shopListingId,
    },
    include: {
      proposer: {
        select: {
          id: true,
          nickname: true,
        },
      },
      photocard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createNotification(data, client = prisma) {
  return client.notification.create({
    data,
  });
}
