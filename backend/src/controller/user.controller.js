import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.UserId;
    const users = await User.find({ clerkId: { $ne: currentUserId } });
  } catch (error) {
    next(error);
  }
};
