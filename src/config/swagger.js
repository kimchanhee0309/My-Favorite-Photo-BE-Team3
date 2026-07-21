import swaggerUi from "swagger-ui-express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "최애의 포토 API",
    version: "1.0.0",
    description: "포토카드 마켓플레이스 API 명세서",
  },
  servers: [
    {
      url: "http://localhost:3001/api",
      description: "Local sever",
    },
  ],
  tags: [
    { name: "Auth", description: "인증 API" },
    { name: "Users", description: "유저 API" },
    { name: "Photocards", description: "포토카드 API" },
    { name: "Ownerships", description: "마이갤러리/보유 카드 API" },
    { name: "ShopListings", description: "마켓플레이스/판매 API" },
    { name: "Exchanges", description: "교환 API" },
    { name: "Points", description: "랜덤 포인트 API" },
    { name: "Notifications", description: "알림 API" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "요청에 성공했습니다" },
          data: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "오류 메시지" },
          code: { type: "string", example: "VALIDATION_ERROR" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "user_id" },
          email: { type: "string", example: "user@test.com" },
          nickname: { type: "string", example: "우디" },
          points: { type: "integer", example: 1540 },
          lastBoxClaimedAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
        },
      },
      Photocard: {
        type: "object",
        properties: {
          id: { type: "string", example: "photocard_id" },
          name: { type: "string", example: "우리집 앞마당" },
          description: { type: "string", example: "햇살 좋은 오후의 정원" },
          imageUrl: {
            type: "string",
            example: "https://image-url.com/card.png",
          },
          genre: {
            type: "string",
            enum: [
              "LANDSCAPE",
              "PORTRAIT",
              "TRAVEL",
              "ANIMAL",
              "OBJECT",
              "ETC",
            ],
            example: "LANDSCAPE",
          },
          grade: {
            type: "string",
            enum: ["COMMON", "RARE", "SUPER_RARE", "LEGENDARY"],
            example: "RARE",
          },
          minPrice: { type: "integer", example: 4 },
          totalQuantity: { type: "integer", example: 5 },
          creatorId: { type: "string", example: "user_id" },
        },
      },
      Ownership: {
        type: "object",
        properties: {
          id: { type: "string", example: "ownership_id" },
          quantity: { type: "integer", example: 2 },
          photocard: { $ref: "#/components/schemas/Photocard" },
        },
      },
      ShopListing: {
        type: "object",
        properties: {
          id: { type: "string", example: "shop_listing_id" },
          quantity: { type: "integer", example: 5 },
          remainingQuantity: { type: "integer", example: 2 },
          pricePerUnit: { type: "integer", example: 4 },
          wishGrade: {
            type: "string",
            nullable: true,
            example: "RARE",
          },
          wishGenre: {
            type: "string",
            nullable: true,
            example: "LANDSCAPE",
          },
          wishDescription: {
            type: "string",
            nullable: true,
            example: "풍경 카드 원해요",
          },
          status: {
            type: "string",
            enum: ["ON_SALE", "SOLD_OUT", "CANCELLED"],
            example: "ON_SALE",
          },
          user: { $ref: "#/components/schemas/User" },
          ownership: { $ref: "#/components/schemas/Ownership" },
        },
      },
      Exchange: {
        type: "object",
        properties: {
          id: { type: "string", example: "exchange_id" },
          offeredQuantity: { type: "integer", example: 1 },
          status: {
            type: "string",
            enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
            example: "PENDING",
          },
          shopListingId: { type: "string", example: "shop_listing_id" },
          proposerId: { type: "string", example: "user_id" },
          photocardId: { type: "string", example: "photocard_id" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "string", example: "notification_id" },
          type: {
            type: "string",
            enum: [
              "EXCHANGE_RECEIVED",
              "EXCHANGE_ACCEPTED",
              "EXCHANGE_REJECTED",
              "PURCHASE_COMPLETED",
              "CARD_SOLD",
              "CARD_SOLD_OUT",
            ],
            example: "EXCHANGE_RECEIVED",
          },
          isRead: { type: "boolean", example: false },
          message: { type: "string", example: "교환 제안이 도착했습니다." },
          targetId: { type: "string", example: "exchange_id" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "회원가입",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "nickname", "password", "passwordConfirm"],
                properties: {
                  email: { type: "string", example: "user@test.com" },
                  nickname: { type: "string", example: "우디" },
                  password: { type: "string", example: "password123" },
                  passwordConfirm: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "회원가입 성공" },
          409: { description: "이메일 또는 닉네임 중복" },
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "로그인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "user@test.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "로그인 성공" },
          401: { description: "이메일 또는 비밀번호 불일치" },
        },
      },
    },

    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "로그아웃",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "로그아웃 성공" },
        },
      },
    },

    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "현재 로그인 사용자 조회",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "조회 성공" },
          401: { description: "인증 필요" },
        },
      },
    },

    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "내 정보 조회",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "내 정보 조회 성공" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "내 정보 수정",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nickname: { type: "string", example: "새닉네임" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "수정 성공" },
        },
      },
    },

    "/photocards": {
      post: {
        tags: ["Photocards"],
        summary: "포토카드 생성",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "name",
                  "description",
                  "imageUrl",
                  "genre",
                  "grade",
                  "minPrice",
                  "totalQuantity",
                ],
                properties: {
                  name: { type: "string", example: "우리집 앞마당" },
                  description: {
                    type: "string",
                    example: "햇살 좋은 오후의 정원",
                  },
                  imageUrl: {
                    type: "string",
                    example: "https://image-url.com/card.png",
                  },
                  genre: { type: "string", example: "LANDSCAPE" },
                  grade: { type: "string", example: "RARE" },
                  minPrice: { type: "integer", example: 4 },
                  totalQuantity: { type: "integer", example: 5 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "포토카드 생성 성공" },
          400: { description: "생성 제한 또는 유효성 오류" },
        },
      },
    },

    "/photocards/me": {
      get: {
        tags: ["Photocards"],
        summary: "내가 생성한 포토카드 목록 조회",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "조회 성공" },
        },
      },
    },

    "/photocards/{photocardId}": {
      get: {
        tags: ["Photocards"],
        summary: "포토카드 원본 상세 조회",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "photocardId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "조회 성공" },
          404: { description: "포토카드 없음" },
        },
      },
    },

    "/ownerships/me": {
      get: {
        tags: ["Ownerships"],
        summary: "마이갤러리 목록 조회",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "keyword", in: "query", schema: { type: "string" } },
          { name: "grade", in: "query", schema: { type: "string" } },
          { name: "genre", in: "query", schema: { type: "string" } },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "integer", default: 15 },
          },
        ],
        responses: {
          200: { description: "조회 성공" },
        },
      },
    },

    "/ownerships/{ownershipId}": {
      get: {
        tags: ["Ownerships"],
        summary: "보유 카드 상세 조회",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "ownershipId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "조회 성공" },
          404: { description: "보유 카드 없음" },
        },
      },
    },

    "/shop-listings": {
      get: {
        tags: ["ShopListings"],
        summary: "마켓플레이스 목록 조회",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "keyword", in: "query", schema: { type: "string" } },
          { name: "grade", in: "query", schema: { type: "string" } },
          { name: "genre", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string" } },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["latest", "oldest", "price_asc", "price_desc"],
            },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "integer", default: 15 },
          },
        ],
        responses: {
          200: { description: "조회 성공" },
        },
      },
      post: {
        tags: ["ShopListings"],
        summary: "판매 등록",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ownershipId", "quantity", "pricePerUnit"],
                properties: {
                  ownershipId: { type: "string", example: "ownership_id" },
                  quantity: { type: "integer", example: 3 },
                  pricePerUnit: { type: "integer", example: 4 },
                  wishGrade: {
                    type: "string",
                    nullable: true,
                    example: "RARE",
                  },
                  wishGenre: {
                    type: "string",
                    nullable: true,
                    example: "LANDSCAPE",
                  },
                  wishDescription: {
                    type: "string",
                    nullable: true,
                    example: "풍경 카드 원해요",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "판매 등록 성공" },
          400: { description: "보유 수량 부족 또는 유효성 오류" },
        },
      },
    },

    "/shop-listings/me": {
      get: {
        tags: ["ShopListings"],
        summary: "나의 판매 포토카드 목록 조회",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "조회 성공" },
        },
      },
    },

    "/shop-listings/{shopListingId}": {
      get: {
        tags: ["ShopListings"],
        summary: "판매 포토카드 상세 조회",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "shopListingId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "조회 성공" },
          404: { description: "판매글 없음" },
        },
      },
      patch: {
        tags: ["ShopListings"],
        summary: "판매 정보 수정",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "shopListingId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requsetBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  pricePerUnit: { type: "integer", example: 5 },
                  wishGrade: {
                    type: "string",
                    nullable: true,
                    example: "SUPER_RARE",
                  },
                  wishGenre: {
                    type: "string",
                    nullable: true,
                    example: "TRAVEL",
                  },
                  wishDescription: {
                    type: "string",
                    nullable: true,
                    example: "여행 카드 원해요",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "수정 성공" },
          403: { description: "판매자만 수정 가능" },
        },
      },
      delete: {
        tags: ["ShopListings"],
        summary: "판매 취소/내리기",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "shopListingId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "판매 취소 성공" },
          403: { description: "판매자만 취소 가능" },
        },
      },
    },

    "/shop-listings/{shopListingId}/purchase": {
      post: {
        tags: ["ShopListings"],
        summary: "포토카드 구매",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "shopListingId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "objet",
                required: ["quantity"],
                properties: {
                  quantity: { type: "integer", example: 2 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "구매 성공" },
          400: { description: "포인트 부족 또는 수량 부족" },
        },
      },
    },

    "/shop-listings/{shopListingId}/exchanges": {
      post: {
        tags: ["Exchanges"],
        summary: "교환 제안 생성",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "shopListingId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["photocardId"],
                properties: {
                  photocardId: {
                    type: "string",
                    example: "offered_photocard_id",
                  },
                  offeredQuantity: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "교환 제안 성공" },
          400: { description: "보유 수량 부족 또는 본인 판매글 제안" },
        },
      },
    },

    "/exchanges/sent": {
      get: {
        tags: ["Exchanges"],
        summary: "내가 보낸 교환 제안 조회",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "조회 성공" },
        },
      },
    },

    "/exchanges/received": {
      get: {
        tags: ["Exchanges"],
        summary: "내가 받은 교환 제안 조회",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "조회 성공" },
        },
      },
    },

    "/exchanges/{exchangeId}/accept": {
      patch: {
        tags: ["Exchanges"],
        summary: "교환 승인",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "exchangeId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "교환 승인 성공" },
        },
      },
    },

    "/exchanges/{exchangeId}/reject": {
      patch: {
        tags: ["Exchanges"],
        summary: "교환 거절",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "exchangeId",
            in: "path",
            reauired: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "교환 거절 성공" },
        },
      },
    },

    "/exchanges/{exchangeId}/cancel": {
      patch: {
        tags: ["Exchanges"],
        summary: "교환 취소",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "exchangeId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "교환 취소 성공" },
        },
      },
    },

    "/points/me": {
      get: {
        tags: ["Points"],
        summary: "내 포인트 조회",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "조회 성공" },
        },
      },
    },

    "/points/random-box": {
      post: {
        tags: ["Points"],
        summary: "랜덤 포인트 획득",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "랜덤 포인트 획득 성공" },
          400: { description: "1시간 쿨타임 미충족" },
        },
      },
    },

    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "알림 목록 조회",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "isRead", in: "query", schema: { type: "boolean" } },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
        ],
        responses: {
          200: { description: "조회 성공" },
        },
      },
    },

    "/notifications/{notificationId}/read": {
      patch: {
        tags: ["Notifications"],
        summary: "알림 읽음 처리",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "notificationId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "읽음 처리 성공" },
        },
      },
    },

    "/notifications/read-all": {
      patch: {
        tags: ["Notifications"],
        summary: "전체 알림 읽음 처리",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "전체 읽음 처리 성공" },
        },
      },
    },
  },
};

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerSpec, {
  explorer: true,
});
