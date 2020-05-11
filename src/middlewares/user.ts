import { Context, Next } from "koa";
import { secret } from "../configs/server.config";
// import { Logger } from "../utils";

const jwt = require("jsonwebtoken");

export default async function parseUserMiddleware(ctx: Context, next: Next) {
  if (ctx.request.header.authorization) {
    const token = ctx.request.header.authorization.split("Bearer ")[1];
    const user = jwt.verify(token, secret).data;
    ctx.user = user;
  }
  await next();
}
