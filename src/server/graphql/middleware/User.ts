import GQLMiddleware from '@server/graphql/GQLMiddleware';
import { MutationResolvers, QueryResolvers } from '@common/GQLTypes';
import { Role } from '@server/sequelize/models/Role';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { UserInfo } from '@server/sequelize/models/UserInfo';
import { UserToken } from '@server/sequelize/models/UserToken';
import { Context } from '../index';
import { createError } from '../GQLErrors';
import sequelize from '../../sequelize/models';

class User extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Query(): QueryResolvers {
    return {
      users: async (parent, { userName, telephone }, ctx: Context) => {
        const userInfo = await ctx.getUser();
        if (!userInfo) throw createError('QL0001');
        const where = { userName, telephone };
        Object.entries(where).forEach(([k, v]) => {
          if (!v) delete where[k];
        });
        return UserInfo.findAll({
          where,
          include: [
            {
              model: Role,
              as: 'role',
            },
          ],
        });
      },
      roles: async (parent, args, ctx: Context) => {
        const userInfo = await ctx.getUser();
        if (!userInfo) throw createError('QL0001');
        return Role.findAll();
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      login: async (parent, { id, password }) => {
        const user = await UserInfo.findOne({
          where: { loginId: id },
          include: [
            {
              model: Role,
              as: 'role',
            },
          ],
        });
        if (!user || !user.hash) throw createError('QL0001');
        if (!await argon2.verify(user.hash, password)) {
          throw createError('QL0001');
        }
        const token = uuidv4();
        await UserToken.create({
          userId: user.userId,
          token,
        });
        return {
          name: user.userName,
          role: user.role,
          token,
        };
      },
      revokeToken: async (parent, args, ctx: Context) => {
        if (ctx.token) {
          await UserToken.destroy({
            where: { token: ctx.token },
          });
        }
        return true;
      },
      addUser: async (parent, { user }, ctx: Context) => {
        const userInfo = await ctx.getUser();
        if (!userInfo) throw createError('QL0001');
        if (!userInfo.role.isAdmin) throw createError('QL0003');
        try {
          await UserInfo.create({
            ...user,
            hash: await argon2.hash(user.password, {
              type: argon2.argon2id,
              memoryCost: 2 ** 16,
              hashLength: 50,
            }),
          });
        } catch (e) {
          throw createError('QL0002');
        }
        return true;
      },
      editUser: async (parent, { userId, user }, ctx: Context) => {
        const userInfo = await ctx.getUser();
        if (!userInfo) throw createError('QL0001');
        if (!userInfo.role.isAdmin) throw createError('QL0003');
        try {
          await UserInfo.update(user, {
            where: { userId },
          });
        } catch (e) {
          throw createError('QL0002');
        }
        return true;
      },
      removeUser: async (parent, { userIds }, ctx: Context) => {
        const userInfo = await ctx.getUser();
        if (!userInfo) throw createError('QL0001');
        if (!userInfo.role.isAdmin) throw createError('QL0003');
        try {
          await sequelize.transaction(async (transaction) => {
            await UserToken.destroy({
              where: { userId: userIds },
              transaction,
            });
            const count = await UserInfo.destroy({
              where: { userId: userIds },
              transaction,
            });
            if (count !== userIds.length) {
              throw createError('QL0002');
            }
          });
        } catch (e) {
          throw createError('QL0002');
        }
        return true;
      },
    };
  }
}

export default User;
