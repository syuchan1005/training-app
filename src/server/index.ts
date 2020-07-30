import Koa from 'koa';
import Serve from 'koa-static';
import BodyParser from 'koa-bodyparser';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';

import GraphQL from './graphql';
import { sync } from './sequelize/models';
import { createRouter } from './pureRoute';

const app = new Koa();
const graphql = new GraphQL();

app.use(BodyParser());

if (process.env.NODE_ENV === 'production') {
  app.use(Serve('dist/client'));
} else {
  app.use(Serve('public_pure'));
}

const pureRouter = createRouter();
app
  .use(pureRouter.routes())
  .use(pureRouter.allowedMethods());

(async () => {
  await sync();
  await graphql.middleware(app);

  app.use(historyApiFallback({}));

  const port = process.env.PORT || 8081;
  const server = app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`👔 listen  at: http://localhost:${port}`);
    console.log(`🚀 graphql at: http://localhost:${port}${graphql.server.graphqlPath}`);
  });

  graphql.useSubscription(server);
})();
