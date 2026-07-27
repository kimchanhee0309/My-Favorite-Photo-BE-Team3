import bcrypt from "bcrypt";
import crypto from "crypto";
import * as authRepository from "./auth.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";
import { signAccessToken } from "../../lib/jwt.js";

export async function signup({ email, nickname, password }) {
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError("이미 존재하는 이메일입니다.", 409, ERROR_CODE.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await authRepository.createUser({
      email,
      nickname,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    if (error.code === "P2002") {
      throw new AppError("이미 존재하는 이메일이거나 닉네임입니다.", 409, ERROR_CODE.CONFLICT);
    }
    throw error;
  }
}

export async function login({ email, password }) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new AppError("이메일 또는 비밀번호가 일치하지 않습니다.", 401, ERROR_CODE.UNAUTHORIZED);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AppError("이메일 또는 비밀번호가 일치하지 않습니다.", 401, ERROR_CODE.UNAUTHORIZED);
  }

  const token = signAccessToken({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  });

  const { password: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}

export async function getMe(userId) {
  const user = await authRepository.findUserById(userId);
  
  if (!user) {
    throw new AppError("유저 정보를 찾을 수 없습니다.", 404, ERROR_CODE.NOT_FOUND);
  }

  const { password: _, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
}

export async function googleCallback(code) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = "http://localhost:3001/auth/google/callback";

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) throw new AppError("구글 토큰 발급에 실패했습니다.", 500);

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  
  const userData = await userResponse.json();
  if (!userResponse.ok) throw new AppError("구글 유저 정보 조회에 실패했습니다.", 500);

  const { email, name } = userData;

  let user = await authRepository.findUserByEmail(email);

  if (!user) {
    const randomPassword = crypto.randomBytes(16).toString("hex");
    const hashedDummyPassword = await bcrypt.hash(randomPassword, 10);
    
    user = await authRepository.createUser({
      email,
      nickname: name || "구글유저",
      password: hashedDummyPassword,
    });
  }

  const token = signAccessToken({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  });

  const { password: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}