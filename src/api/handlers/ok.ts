import { RequestHandler } from "express";

export function okHandler(): RequestHandler {
  return (_, res) => {
    res.sendStatus(200);
  };
}
