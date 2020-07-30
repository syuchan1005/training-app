// @ts-ignore
import path from 'path';
import { FindOptions } from 'sequelize';

import {
  ApolloServer,
  makeExecutableSchema,
  PubSub,
  PubSubEngine,
} from 'apollo-server-koa';

// @ts-ignore
import typeDefs from '@server/schema.graphql';
import GQLMiddleware from '@server/graphql/GQLMiddleware';
import { UserInfo } from '../sequelize/models/UserInfo';
import { UserToken } from '../sequelize/models/UserToken';
import { Role } from '../sequelize/models/Role';

export type Context = {
  token?: string;
  getUser: (options?: FindOptions) => Promise<UserInfo>;
};

export default class GraphQL {
  private readonly middlewares: { [key: string]: GQLMiddleware };

  public readonly server: ApolloServer;

  private readonly gqlKoaMiddleware; // : (ctx: any, next: Promise<any>) => any;

  private readonly pubsub: PubSubEngine;

  constructor() {
    this.pubsub = new PubSub();

    // @ts-ignore
    const context = require.context('./middleware', false, /\.ts$/);
    this.middlewares = {
      ...(context.keys().reduce((obj, p) => {
        const df = context(p).default;
        if (df) {
          // eslint-disable-next-line no-param-reassign,new-cap
          obj[path.basename(p, path.extname(p))] = new df();
        }
        return obj;
      }, {})),
    };
    const middlewareOps = (key) => Object.keys(this.middlewares)
      .map((k) => {
        const fun = this.middlewares[k][key];
        return fun ? fun.bind(this)(this) : {};
      }).reduce((a, o) => ({ ...a, ...o }), {});

    const resolvers = {
      /* handler(parent, args, context, info) */
      Query: middlewareOps('Query'),
      Mutation: middlewareOps('Mutation'),
      Subscription: middlewareOps('Subscription'),
    };
    Object.keys(resolvers).forEach((k) => {
      if (Object.keys(resolvers[k]).length === 0) delete resolvers[k];
    });

    // eslint-disable-next-line no-underscore-dangle
    this.server = new ApolloServer({
      schema: makeExecutableSchema({
        typeDefs,
        resolvers,
      }),
      context: (data): Context => {
        const authorization = data?.ctx?.request?.header?.authorization;
        let token = authorization || '';
        if (token.startsWith('Bearer ')) {
          token = token.substring('Bearer '.length);
          return {
            token,
            getUser: async (options = {}) => {
              const t = await UserToken.findOne({
                ...options,
                where: {
                  token,
                  ...(options.where),
                },
                include: [
                  {
                    model: UserInfo,
                    as: 'user',
                    include: [
                      {
                        model: Role,
                        as: 'role',
                      },
                    ],
                  },
                  ...(options?.include || []),
                ],
              });
              return t?.user;
            },
          };
        }
        return { getUser: () => Promise.resolve(undefined) };
      },
      tracing: process.env.NODE_ENV !== 'production',
    });
    this.gqlKoaMiddleware = this.server.getMiddleware({});
  }

  async middleware(app) {
    // eslint-disable-next-line no-underscore-dangle
    app.use((ctx, next) => {
      ctx.request.socket.setTimeout(/* 15min */ 15 * 60 * 1000);
      return this.gqlKoaMiddleware(ctx, next);
    });
  }

  useSubscription(httpServer) {
    // eslint-disable-next-line no-underscore-dangle
    this.server.installSubscriptionHandlers(httpServer);
  }
}
