import {genID} from './Helper';
export const login = ({account, password}) =>
  `SELECT id, name, nickname from "user" where name='${account}' and password='${password}'`;

export const isUserExist = (account: string) => {
  return `select * from "user" where "name"='${account}'`;
};
export const register = ({account, password}) => {
  const id = genID();
  return `INSERT INTO "user" ("id", "name", "password", nickname, "reg_date")
  VALUES('${id}', '${account}', '${password}', '${account}', '${new Date().toUTCString()}')`;
};
