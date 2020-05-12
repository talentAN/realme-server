export const addDraft = ({
  id,
  type = 'chapter',
  user,
  last_modified = new Date().toUTCString(),
}) => `
INSERT INTO "draft" ("id","type","title", "content", "auth", "last_modified") VALUES('${id}', '${type}', '', '', '${user}', '${last_modified}')
`;
export const updateDraft = ({id, title, content}) =>
  `update "draft" set title='${title}', content='${content}' where id='${id}'`;
export const queryDraft = (id: string) => `select * from "draft" where id='${id}'`;
export const publishDraft = ({id, title, content, type, auth, last_modified}) =>
  `INSERT INTO "chapter" ("id", "title", "content", "type", "auth", "publish_date") VALUES('${id}', '${title}', '${content}', '${type}', '${auth}', '${last_modified}')`;
export const deleteDraft = (id: string) => `DELETE FROM "draft" where id='${id}'`;
export const countMyDrafts = (id: string) => `select count(*) from "draft" where "auth"='${id}'`;
export const queryList = ({offset, limit, user}) =>
  `select * from "draft" where "auth"='${user}' ORDER by last_modified DESC OFFSET ${offset} LIMIT ${limit};`;
export const queryItem = (id: string) => `select * from "draft" where "id"='${id}'`;
