import { Logger } from '../utils';
import { Pool as postgresPool, types } from 'pg';
import * as crypto from 'crypto';

const _poolCreator = dbConfig => {
  const pool = new postgresPool(dbConfig)
  return pool;
}
export default function dbMixin(ctx) {
  ctx.db = {
    configs: new Map(),
    pools: new Map(),
    lastClientId: "",
    hash: function (dbID: string): string {
      return crypto
        .createHash('md5')
        .update(dbID)
        .digest('hex');
    },
    set: function (dbConfigs) {
      const hash = ctx.db.hash(JSON.stringify(dbConfigs));
      ctx.db.configs.set(hash, { id: hash, ...dbConfigs });
      return hash;
    },
    setupClient: async function (dbConfig) {
      const hash = ctx.db.set(dbConfig);
      if (ctx.db.pools.has(hash)) {
        Logger(`return cached db client ${hash}`);
        ctx.db.lastClientId = hash;
        return { id: hash, client: ctx.db.pools.get(hash) };
      }
      const pool = _poolCreator(dbConfig)
      pool.on('error', err => {
        Logger('Unexpected error on idle client', err);
      });
      // store the connection
      ctx.db.set(dbConfig);
      ctx.db.pools.set(hash, pool);
      Logger(`create new db client ${JSON.stringify(dbConfig)}`);
      ctx.db.lastClientId = hash;
      // return the pool
      return { id: hash, client: pool };
    },
    getDbClient: function (id) {
      const client = ctx.db.pools.get(id);
      if (!client) {
        ctx.throw(503, 'database not configured');
      }
      return client;
    },
    query: async function (sql: string, dbClient) {
      const result = await dbClient
        .query(sql)
        .then(res => {
          const { rows } = res;
          return rows && rows;
        })
        .catch((e: any) => {
          Logger(`Query: error ${sql} ${JSON.stringify(e)}`);
        })
      return result;
    }
  }
  return ctx;
}