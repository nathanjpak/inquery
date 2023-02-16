import 'reflect-metadata';
import 'dotenv';

import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import express from 'express';
import {buildTypeDefsAndResolvers} from 'type-graphql';
import cors from 'cors';
import {json} from 'body-parser';
import {DataSource} from 'typeorm';
import session from 'express-session';
import connectRedis from 'connect-redis';
import {redis} from './redis';

import {CurrentUserResolver} from './modules/user/CurrentUser';
import {LoginResolver} from './modules/user/Login';
import {RegisterResolver} from './modules/user/Register';
import {MyContext} from './types/MyContext';

// import {ApolloServerPluginLandingPageGraphQLPlayground} from '@apollo/server-plugin-landing-page-graphql-playground';
import {ApolloServerPluginLandingPageLocalDefault} from '@apollo/server/plugin/landingPage/default';
import {LogoutResolver} from './modules/user/Logout';

const ormconfig = require('../ormconfig.json');

// Declaration merging for express-session
declare module 'express-session' {
  export interface SessionData {
    userId: number;
  }
}

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

  app.set('trust proxy', 1);
  // app.set('Access-Control-Allow-Credentials', true);

  const {typeDefs, resolvers} = await buildTypeDefsAndResolvers({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      CurrentUserResolver,
      LogoutResolver,
    ],
    // authChecker: ({context: {req}}) => !!req.session.userId,
  });

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        includeCookies: true,
      }),
    ],
  });

  await server.start();

  // Connect to redis for session management

  const RedisStore = connectRedis(session);

  type SameSite = 'none' | 'lax';

  const cookieSettings: {sameSite: SameSite; secure?: boolean} =
    process.env.NODE_ENV === 'production'
      ? {
          sameSite: 'none',
          secure: true,
        }
      : {
          sameSite: 'lax',
        };

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'qid',
      resave: false,
      saveUninitialized: false,
      secret: 'bunn10n',
      cookie: {
        ...cookieSettings,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
      },
    })
  );

  app.use(
    '/graphql',
    cors({
      credentials: true,
      origin: ['http://localhost:3031', 'https://studio.apollographql.com'],
    }),
    json(),
    expressMiddleware(server, {
      context: async ({req, res}) => ({req: req, res: res}),
    })
  );

  app.listen(8099, () => {
    console.log('Server started at port 8099');
  });
})();
