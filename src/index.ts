import 'reflect-metadata';

import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import express from 'express';
import {buildTypeDefsAndResolvers, Resolver, Query} from 'type-graphql';
import cors from 'cors';
import {json} from 'body-parser';

// test resolver
@Resolver()
class testResolver {
  @Query(() => String)
  async tests() {
    return 'Hello World';
  }
}

(async () => {
  const app = express();

  const {typeDefs, resolvers} = await buildTypeDefsAndResolvers({
    resolvers: [testResolver],
  });

  const server = new ApolloServer({typeDefs, resolvers});

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server)
  );

  app.listen(8099, () => {
    console.log('Server started at port 8099');
  });
})();
