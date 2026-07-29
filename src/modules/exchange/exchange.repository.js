import { prisma } from "../../lib/prisma.js";

const includeExchangeDetail = {
  proposer: {
    select: {
      id: true,
      nickname: true,
    },
  },
  photocard: true,
  shopListing: {
    include: {
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
    },
  },
};

export async function findShopListingById(shopListingId, client = prisma) {
  return client.shopListing.findUnique({
    where: { id: shopListingId },
    include: {
      ownership: {
        include: {
          photocard: true,
        },
      },
      user: true,
    },
  });
}

export async function findOwnershipByUserAndPhotocard(
  userId,
  photocardId,
  client = prisma,
) {
  return client.ownership.findUnique({
    where: {
      userId_photocardId: {
        userId,
        photocardId,
      },
    },
    include: {
      photocard: true,
      user: {
        select: { nickname: true },
      },
    },
  });
}

export async function createExchange(data, client = prisma) {
  return client.exchange.create({
    data,
    include: includeExchangeDetail,
  });
}

export async function findExchangeById(exchangeId, client = prisma) {
  return client.exchange.findUnique({
    where: { id: exchangeId },
    include: includeExchangeDetail,
  });
}

export async function findExchanges({ where, orderBy, take }, client = prisma) {
  return client.exchange.findMany({
    where,
    orderBy,
    take,
    include: includeExchangeDetail,
  });
}

export async function updateExchange(exchangeId, data, client = prisma) {
  return client.exchange.update({
    where: { id: exchangeId },
    data,
    include: includeExchangeDetail,
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

export async function updateShopListing(shopListingId, data, client = prisma) {
  return client.shopListing.update({
    where: { id: shopListingId },
    data,
    include: {
      ownership: {
        include: {
          photocard: true,
        },
      },
    },
  });
}
