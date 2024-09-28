import { ObjectId } from "mongodb";

export type UserModel = {
  email: string;
  emailVerified?: Date;
  locale: string;
};

export type VerificationModel = {
  identifier: string;
  expires: Date;
};
