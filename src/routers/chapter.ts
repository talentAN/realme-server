import {IsNotEmpty, IsString, IsNumber, ValidateNested} from 'class-validator';
// import {Type} from 'class-transformer';
import {hots} from '../../mock/Chapter';
import {Logger, queryDB} from '../utils';
import {
  getLatest,
  getLikes,
  getCollects,
  getHuged,
  insertHug,
  insertLike,
  insertCollect,
  deleteHug,
  deleteCollect,
  deleteLike,
} from '../sql/chapter';

class ChapterReq {
  @ValidateNested({each: true})
  @IsString()
  @IsNotEmpty({
    message: 'The property type can not be empty',
  })
  readonly type;

  @IsNumber()
  readonly offset;

  @IsNumber()
  readonly length;

  @IsString()
  readonly token;
}
enum Type {
  Latest = 'Latest',
  Detail = 'Detail',
  Hug = 'Hug',
  CancelHug = 'CancelHug',
  Like = 'Like',
  CancelLike = 'CancelLike',
  Collect = 'Collect',
  CancelCollect = 'CancelCollect',
}

export default function chapter(router) {
  router.post('/chapter', async (ctx, next) => {
    const {type, id} = ctx.request.body;
    const user = ctx.user;
    let result: any = [];
    switch (type) {
      case Type.Latest:
        const {offset, limit} = ctx.request.body;
        Logger(`${user} query ${type} with limit:${limit}, offset:${offset}`);
        const chapters = await queryDB({offset, limit}, ctx, getLatest);
        result = await Promise.all(
          chapters.map(async chapter => {
            const users_huged = await queryDB(chapter.id, ctx, getHuged);
            const users_liked = await queryDB(chapter.id, ctx, getLikes);
            const users_collected = await queryDB(chapter.id, ctx, getCollects);
            const is_liked = users_liked.some(item => item.userid === user);
            const is_collected = users_collected.some(item => item.userid === user);
            const is_huged = users_huged.some(item => item.userid === user);
            return {
              ...chapter,
              num_huged: users_huged.length,
              num_liked: users_liked.length,
              num_collected: users_collected.length,
              is_huged,
              is_liked,
              is_collected,
            };
          })
        );
        break;
      case Type.Hug:
        result = await queryDB({chapterid: id, userid: user}, ctx, insertHug);
        result = Array.isArray(result) ? {status: 'success'} : {status: 'fail'};
        break;
      case Type.CancelHug:
        result = await queryDB({chapterid: id, userid: user}, ctx, deleteHug);
        result = Array.isArray(result) ? {status: 'success'} : {status: 'fail'};
        break;
      case Type.Like:
        result = await queryDB({chapterid: id, userid: user}, ctx, insertLike);
        result = Array.isArray(result) ? {status: 'success'} : {status: 'fail'};
      case Type.CancelLike:
        result = await queryDB({chapterid: id, userid: user}, ctx, deleteLike);
        result = Array.isArray(result) ? {status: 'success'} : {status: 'fail'};

      case Type.Collect:
        result = await queryDB({chapterid: id, userid: user}, ctx, insertCollect);
        result = Array.isArray(result) ? {status: 'success'} : {status: 'fail'};
      case Type.CancelCollect:
        result = await queryDB({chapterid: id, userid: user}, ctx, deleteCollect);
        result = Array.isArray(result) ? {status: 'success'} : {status: 'fail'};
      default:
        result = hots;
        break;
    }
    ctx.body = result;
    await next();
  });
}
