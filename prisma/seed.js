import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const PASSWORD = "password123!";

const users = [
  {
    email: "seller@example.com",
    nickname: "판매자유디",
    points: 1540,
  },
  {
    email: "buyer@example.com",
    nickname: "구매자민수",
    points: 3000,
  },
  {
    email: "collector@example.com",
    nickname: "수집가찬희",
    points: 2200,
  },
];

const photocardSeeds = [
  {
    key: "garden",
    name: "우리집 앞마당",
    description: "햇살이 가득한 정원의 여유로운 오후를 담은 포토카드입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    genre: "LANDSCAPE",
    grade: "LEGENDARY",
    minPrice: 4,
    totalQuantity: 5,
    creatorEmail: "seller@example.com",
  },
  {
    key: "spain",
    name: "스페인 여행",
    description: "따뜻한 노을빛이 도시를 감싸는 스페인 여행 사진입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800",
    genre: "TRAVEL",
    grade: "COMMON",
    minPrice: 4,
    totalQuantity: 8,
    creatorEmail: "buyer@example.com",
  },
  {
    key: "island",
    name: "How Far I'll Go",
    description: "잔잔한 바다 위 섬과 노을을 담은 풍경 포토카드입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    genre: "LANDSCAPE",
    grade: "SUPER_RARE",
    minPrice: 4,
    totalQuantity: 6,
    creatorEmail: "collector@example.com",
  },
  {
    key: "cat",
    name: "고양이 낮잠",
    description: "따뜻한 햇빛 아래 잠든 고양이의 평화로운 순간입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
    genre: "ANIMAL",
    grade: "RARE",
    minPrice: 3,
    totalQuantity: 7,
    creatorEmail: "seller@example.com",
  },
  {
    key: "portrait",
    name: "도시의 초상",
    description: "도시의 밤과 인물의 분위기가 어우러진 포트레이트입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
    genre: "PORTRAIT",
    grade: "RARE",
    minPrice: 5,
    totalQuantity: 4,
    creatorEmail: "buyer@example.com",
  },
];

async function clearData() {
  await prisma.notification.deleteMany();
  await prisma.exchange.deleteMany();
  await prisma.shopListing.deleteMany();
  await prisma.ownership.deleteMany();
  await prisma.photocard.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  const createdUsers = {};

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        nickname: user.nickname,
        password: hashedPassword,
        points: user.points,
        lastBoxClaimedAt: null,
      },
    });

    createdUsers[user.email] = createdUser;
  }

  return createdUsers;
}

async function seedPhotocards(createdUsers) {
  const createdPhotocards = {};

  for (const card of photocardSeeds) {
    const createdCard = await prisma.photocard.create({
      data: {
        name: card.name,
        description: card.description,
        imageUrl: card.imageUrl,
        genre: card.genre,
        grade: card.grade,
        minPrice: card.minPrice,
        totalQuantity: card.totalQuantity,
        creatorId: createdUsers[card.creatorEmail].id,
      },
    });

    createdPhotocards[card.key] = createdCard;
  }

  return createdPhotocards;
}

async function seedOwnerships(createdUsers, createdPhotocards) {
  const ownerships = {};

  const ownershipSeeds = [
    {
      key: "seller_garden",
      userEmail: "seller@example.com",
      cardKey: "garden",
      quantity: 3,
    },
    {
      key: "seller_cat",
      userEmail: "seller@example.com",
      cardKey: "cat",
      quantity: 2,
    },
    {
      key: "buyer_spain",
      userEmail: "buyer@example.com",
      cardKey: "spain",
      quantity: 4,
    },
    {
      key: "buyer_portrait",
      userEmail: "buyer@example.com",
      cardKey: "portrait",
      quantity: 2,
    },
    {
      key: "collector_island",
      userEmail: "collector@example.com",
      cardKey: "island",
      quantity: 3,
    },
    {
      key: "collector_spain",
      userEmail: "collector@example.com",
      cardKey: "spain",
      quantity: 1,
    },
  ];

  for (const ownership of ownershipSeeds) {
    const createdOwnership = await prisma.ownership.create({
      data: {
        userId: createdUsers[ownership.userEmail].id,
        photocardId: createdPhotocards[ownership.cardKey].id,
        quantity: ownership.quantity,
      },
    });

    ownerships[ownership.key] = createdOwnership;
  }

  return ownerships;
}

async function seedShopListings(createdUsers, ownerships) {
  const listings = {};

  listings.gardenOnSale = await prisma.shopListing.create({
    data: {
      userId: createdUsers["seller@example.com"].id,
      ownershipId: ownerships.seller_garden.id,
      quantity: 2,
      remainingQuantity: 2,
      pricePerUnit: 4,
      wishGrade: "RARE",
      wishGenre: "LANDSCAPE",
      wishDescription:
        "푸릇푸릇한 여름 풍경이나 눈이 많이 내린 겨울 풍경 사진에 관심이 많습니다.",
      status: "ON_SALE",
    },
  });

  listings.catOnSale = await prisma.shopListing.create({
    data: {
      userId: createdUsers["seller@example.com"].id,
      ownershipId: ownerships.seller_cat.id,
      quantity: 1,
      remainingQuantity: 1,
      pricePerUnit: 3,
      wishGrade: "COMMON",
      wishGenre: "ANIMAL",
      wishDescription: "귀여운 동물 사진이면 좋아요.",
      status: "ON_SALE",
    },
  });

  listings.islandSoldOut = await prisma.shopListing.create({
    data: {
      userId: createdUsers["collector@example.com"].id,
      ownershipId: ownerships.collector_island.id,
      quantity: 1,
      remainingQuantity: 0,
      pricePerUnit: 5,
      wishGrade: "RARE",
      wishGenre: "TRAVEL",
      wishDescription: "여행 사진과 교환을 희망합니다.",
      status: "SOLD_OUT",
    },
  });

  return listings;
}

async function seedExchanges(createdUsers, createdPhotocards, listings) {
  const exchange = await prisma.exchange.create({
    data: {
      shopListingId: listings.gardenOnSale.id,
      proposerId: createdUsers["buyer@example.com"].id,
      photocardId: createdPhotocards.spain.id,
      message:
        "스페인 여행 사진도 좋은데, 우리집 앞마당 포토카드와 교환하고 싶습니다!",
      status: "PENDING",
    },
  });

  await prisma.exchange.create({
    data: {
      shopListingId: listings.gardenOnSale.id,
      proposerId: createdUsers["collector@example.com"].id,
      photocardId: createdPhotocards.island.id,
      message: "여름 바다 풍경 사진과 교환하실래요?",
      status: "PENDING",
    },
  });

  return exchange;
}

async function seedNotifications(createdUsers, listings, exchange) {
  await prisma.notification.createMany({
    data: [
      {
        userId: createdUsers["seller@example.com"].id,
        type: "EXCHANGE_RECEIVED",
        targetId: exchange.id,
        message: "스페인 여행 카드로 교환 제안이 도착했습니다.",
        isRead: false,
      },
      {
        userId: createdUsers["buyer@example.com"].id,
        type: "PURCHASE_COMPLETED",
        targetId: listings.catOnSale.id,
        message: "고양이 낮잠 구매가 완료되었습니다.",
        isRead: false,
      },
      {
        userId: createdUsers["collector@example.com"].id,
        type: "CARD_SOLD_OUT",
        targetId: listings.islandSoldOut.id,
        message: "How Far I'll Go 판매글이 품절되었습니다.",
        isRead: true,
      },
    ],
  });
}

async function main() {
  console.log("Seed start");

  await clearData();

  const createdUsers = await seedUsers();
  const createdPhotocards = await seedPhotocards(createdUsers);
  const ownerships = await seedOwnerships(createdUsers, createdPhotocards);
  const listings = await seedShopListings(createdUsers, ownerships);
  const exchange = await seedExchanges(
    createdUsers,
    createdPhotocards,
    listings,
  );

  await seedNotifications(createdUsers, listings, exchange);

  console.log("Seed completed");
  console.log("Login test accounts:");
  console.log(`seller@example.com / ${PASSWORD}`);
  console.log(`buyer@example.com / ${PASSWORD}`);
  console.log(`collector@example.com / ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
