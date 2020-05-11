import * as jwt from 'jsonwebtoken';
import {DB_CONFIG} from '../services/db';
const chalk = require('chalk');

export function Logger(...args: any) {
  if (process.env.NODE_ENV === 'test') {
    return '';
  }
  const now = new Date();
  return console.log.apply(console, [
    chalk.hex('#00ca64')(`${now.toLocaleDateString()}.${now.getMilliseconds()}: `),
    ...args,
  ]);
}
export const parseToken = (request: any) => {
  const token = request.headers.authorization.split('Bearer ')[1];
  return jwt.decode(token);
};
export const queryDB = async (params: any, ctx: any, sqlGenerater) => {
  const {client} = await ctx.db.setupClient(DB_CONFIG);
  const sql = sqlGenerater(params);
  const res = await ctx.db.query(sql, client);
  return res;
};
