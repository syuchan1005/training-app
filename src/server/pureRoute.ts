import Router from 'koa-router';
import { v4 as uuidv4 } from 'uuid';
import { QueryTypes } from 'sequelize';
import sequelize from './sequelize/models';
import { UserInfo } from './sequelize/models/UserInfo';
import { UserToken } from './sequelize/models/UserToken';

// eslint-disable-next-line import/prefer-default-export
export const createRouter = (prefix = '/api') => {
  const router = new Router();

  router.post(`${prefix}/login`, async (ctx) => {
    const users = await sequelize.query(`SELECT * FROM ${UserInfo.tableName} AS UserInfo
         WHERE loginId = '${ctx.request.body.id}' AND password = '${ctx.request.body.pass}'`, {
      type: QueryTypes.SELECT,
      model: UserInfo,
      mapToModel: true,
    });
    const user: UserInfo = users[0];
    if (user) {
      const token = uuidv4();
      await sequelize.query(`INSERT INTO UserTokens (id,token,userId) VALUES (NULL,'${token}',${user.userId})`, {
        type: QueryTypes.INSERT,
      });
      ctx.status = 200;
      ctx.body = {
        name: user.userName,
        role: user.roleId === 1 ? 'admin' : null,
        token,
      };
    } else {
      ctx.status = 401;
    }
  });

  router.post(`${prefix}/user/search`, async (ctx) => {
    const { userName, telephone } = ctx.request.body;
    const where = {
      userName: userName || undefined,
      telephone: telephone || undefined,
    };
    Object.keys(where).forEach((k) => {
      if (!where[k]) delete where[k];
    });
    let whereText = '';
    if (Object.keys(where).length !== 0) {
      whereText = `WHERE ${
        Object.entries(where).map(([k, v]) => `${k} = '${v}'`).join(' AND ')
      }`;
    }

    const infos: Array<UserInfo> = await sequelize.query(`SELECT * FROM ${UserInfo.tableName} AS UserInfo ${whereText}`, {
      type: QueryTypes.SELECT,
      model: UserInfo,
      mapToModel: true,
    });

    ctx.status = 200;
    ctx.body = JSON.stringify(infos.map((i) => i.dataValues));
  });

  router.post(`${prefix}/user`, async (ctx) => {
    if (!ctx.request.body?.token || !ctx.request.body?.info) {
      ctx.status = 401;
      return;
    }
    const tokens = await sequelize.query(`SELECT
    user.roleId
FROM ${UserToken.tableName} AS UserToken
 LEFT OUTER JOIN UserInfos AS user
  ON UserToken.userId = user.userId
WHERE UserToken.token = '${ctx.request.body.token}' LIMIT 1;`, {
      type: QueryTypes.SELECT,
    });
    // @ts-ignore
    const { roleId } = tokens[0];
    if (roleId !== 1) {
      ctx.status = 401;
      return;
    }
    const body = ctx.request.body.info;
    await sequelize.query(`INSERT INTO ${UserInfo.tableName} (userId,loginId,userName,telephone,password,roleId)
  VALUES (NULL,'${body.loginId}','${body.userName}','${body.telephone}','${body.password}',${body.roleId})`, {
      type: QueryTypes.INSERT,
    });

    ctx.status = 200;
  });

  router.put(`${prefix}/user`, async (ctx) => {
    const { body } = ctx.request;
    await sequelize.query(`UPDATE ${UserInfo.tableName}
 SET loginId='${body.loginId}',userName='${body.userName}',telephone='${body.telephone}',
 roleId=${body.roleId},password='${body.password}',userId='${body.userId}' WHERE userId = '${body.userId}'`, {
      type: QueryTypes.UPDATE,
    });

    ctx.status = 200;
  });

  router.delete(`${prefix}/user`, async (ctx) => {
    await sequelize.transaction(async (transaction) => {
      await sequelize.query(`DELETE FROM ${UserToken.tableName}
 WHERE userId IN (${ctx.request.body.join(',')});`, {
        type: QueryTypes.DELETE,
        transaction,
      });
      await sequelize.query(`DELETE FROM ${UserInfo.tableName}
 WHERE userId IN (${ctx.request.body.join(',')});`, {
        type: QueryTypes.DELETE,
        transaction,
      });
    });

    ctx.status = 200;
  });

  return router;
};
