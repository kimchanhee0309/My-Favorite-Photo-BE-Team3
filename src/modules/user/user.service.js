import * as userRepository from "./user.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";

export async function updateMe(userId, data) {
  try {
    const updatedUser = await userRepository.updateUser(userId, data);
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    if (error.code === "P2002") {
      throw new AppError("이미 사용 중인 닉네임입니다.", 409, ERROR_CODE.CONFLICT);
    }
    throw error;
  }
}