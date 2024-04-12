import { ObjectId } from "mongodb";

export type UserModel = {
  email: string;
  emailVerified?: Date;
};

export type VerificationModel = {
  identifier: string;
  expires: Date;
};
