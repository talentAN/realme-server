import {genID} from './Helper';

export const getLatest = ({limit, offset}) => {
  return `select chapter.id as id, title, content, num_huged 
  from chapter left join 
  (select "id", num_huged from 
    (select chapterid as "id", count(chapterid) as num_huged from hug group by chapterid) as "hug_table") 
  as hug_count on chapter.id=hug_count.id ORDER by publish_date DESC OFFSET ${offset} LIMIT ${limit};`;
};
export const getLikes = (chapterid: string) =>
  `SELECT userid from "like" where chapterid= '${chapterid}'`;
export const insertLike = ({chapterid, userid}) =>
  `INSERT INTO "like" ("id", "chapterid", "userid", "create_date") VALUES('${genID()}', '${chapterid}', '${userid}', '${new Date().toUTCString()}')`;
export const deleteLike = ({chapterid, userid}) =>
  `delete from "like" where "chapterid"='${chapterid}' and "userid"='${userid}'`;

export const getCollects = (chapterid: string) =>
  `SELECT userid from "collect" where chapterid= '${chapterid}'`;
export const insertCollect = ({chapterid, userid}) =>
  `INSERT INTO "collect" ("id", "chapterid", "userid", "create_date") VALUES('${genID()}', '${chapterid}', '${userid}', '${new Date().toUTCString()}')`;
export const deleteCollect = ({chapterid, userid}) =>
  `delete from "collect" where "chapterid"='${chapterid}' and "userid"='${userid}'`;
export const countMyCollects = (id: string) => `select count(*) from "collect" where "userid"='${id}'`;

export const getHuged = (chapterid: string) =>
  `SELECT userid from "hug" where chapterid= '${chapterid}'`;
export const insertHug = ({
  chapterid,
  userid,
}) => `INSERT INTO "hug" ("id", "chapterid", "userid", "create_date")
VALUES('${genID()}', '${chapterid}', '${userid}', '${new Date().toUTCString()}')`;
export const deleteHug = ({chapterid, userid}) =>
  `delete from "hug" where "chapterid"='${chapterid}' and "userid"='${userid}'`;
