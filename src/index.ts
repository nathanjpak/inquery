import 'reflect-metadata';

import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import express from 'express';
import {buildTypeDefsAndResolvers} from 'type-graphql';
import cors from 'cors';
import {json} from 'body-parser';
import {DataSource} from 'typeorm';

import {RegisterResolver} from './modules/user/Register';

const ormconfig = require('../ormconfig.json');

(async () => {
  const AppDataSource = new DataSource(ormconfig);

  await AppDataSource.initialize()
    .then(() => {
      console.log('Data source has been initialized');
    })
    .catch(err => {
      console.error('Error during data source initialization', err);
    });

  const app = express();

  const {typeDefs, resolvers} = await buildTypeDefsAndResolvers({
    resolvers: [RegisterResolver],
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
