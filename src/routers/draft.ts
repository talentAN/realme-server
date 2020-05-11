import {Logger, queryDB} from '../utils';
import {
  addDraft,
  updateDraft,
  queryDraft,
  publishDraft,
  deleteDraft,
  countMyDrafts,
} from '../sql/draft';

enum Type {
  Add = 'add',
  Update = 'update',
  Delete = 'delete',
  Query = 'query',
  Publish = 'publish',
  Count = 'count',
}
export default function draft(router) {
  router.post('/draft', async (ctx, next) => {
    const {type, id} = ctx.request.body;
    const user = ctx.user;
    let result: any = [];
    switch (type) {
      case Type.Add:
        Logger(`Add New Draft`);
        result = await queryDB({id, user}, ctx, addDraft);
        result = Array.isArray(result) ? {status: 'success', id} : {status: 'fail'};
        break;
      case Type.Update:
        Logger(`Update Draft`);
        const {title, content} = ctx.request.body;
        result = await queryDB({id, title, content}, ctx, updateDraft);
        result = Array.isArray(result) ? {status: 'success'} : {status: 'fail'};
        break;
      case Type.Publish:
        Logger(`Publish draft: ${id}`);
        //查询
        result = await queryDB(id, ctx, queryDraft);
        result = {...result[0], last_modified: new Date(result[0].last_modified).toUTCString()};
        //发布
        result = await queryDB(result, ctx, publishDraft);
        result = Array.isArray(result) ? {status: 'success', id} : {status: 'fail'};
        //删除草稿
        await queryDB(id, ctx, deleteDraft);
        break;
      case Type.Count:
        result = await queryDB(user, ctx, countMyDrafts);
        result = Array.isArray(result)
          ? {status: 'success', count: result[0].count}
          : {status: 'fail'};
        break;
      default:
        result = false;
    }
    ctx.body = result;
    await next();
  });
}
