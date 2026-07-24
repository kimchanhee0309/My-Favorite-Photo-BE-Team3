import bcrypt from "bcrypt";
import * as authRepository from "./auth.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";

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