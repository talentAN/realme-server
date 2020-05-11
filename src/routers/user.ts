import {secret, jwtExpires} from '../configs/server.config';
import * as jwt from 'jsonwebtoken';
import {Logger, queryDB} from '../utils';
import {login, register, isUserExist} from '../sql/user';

export default function auth(router) {
  router.post('/user', async (ctx, next) => {
    const {type, account, password} = ctx.request.body;
    let result: any = false;
    let res_query: any;
    switch (type) {
      case 'login':
        Logger(`${account} login with password: ${password}`);
        res_query = await queryDB({account, password}, ctx, login);
        const curr = res_query && res_query[0];
        if (curr) {
          Logger(`User "${curr.name}" login successful`);
          const token = jwt.sign(
            {
              data: curr.id,
            },
            secret,
            {expiresIn: jwtExpires}
          );
          result = {id: curr.nickname, token};
        } else {
          ctx.status = 401;
          ctx.body = {
            message: '密码错误',
          };
        }
        break;
      case 'register':
        Logger(`${account} register with password: ${password}`);
        const user = await queryDB(account, ctx, isUserExist);
        const is_exists = user && user[0];
        if (is_exists) {
          result = {
            status: 'fail',
            message: 'user already exists',
          };
        } else {
          res_query = await queryDB({account, password}, ctx, register);
          Logger(res_query);
          result = res_query ? {status: 'success', message: 'success'} : undefined;
        }
        break;
      default:
        result = false;
        break;
    }
    ctx.body = result;
    await next();
  });
}
