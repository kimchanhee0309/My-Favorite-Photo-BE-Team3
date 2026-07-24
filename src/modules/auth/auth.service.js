import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";
import { id } from "zod/locales";

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

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_SECRET_IN || "7d" }
  );

  const { password: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}