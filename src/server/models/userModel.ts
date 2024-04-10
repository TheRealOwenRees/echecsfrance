import { ObjectId } from "mongodb";

export type UserModel = {
  email: string;
  emailVerified?: Date;
};
