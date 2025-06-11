import { Request } from "express";
import { JwtPayload } from "./jwt";

export type AuthorizedRequest = Request & {
  user: JwtPayload;
};
