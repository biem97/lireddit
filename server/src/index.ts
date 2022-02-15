import { MikroORM } from "@mikro-orm/core";

// Constants
import { __prod___ } from "./constants";

// Micro Config
import microConfig from "./mikro-orm.config";

// Server
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

// redis@v4
import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";
const main = async () => {
  const orm = await MikroORM.init(microConfig);

  // Run migration
  await orm.getMigrator().up();

  const app = express();

  const redisClient = createClient({ legacyMode: true });
  const RedisStore = connectRedis(session);
  redisClient.connect().catch(console.error);

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        // disableTouch: true,
        disableTTL: true,
      }),
      saveUninitialized: false,
      // TODO: Using environment variable
      secret: "keyboard cat",
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true, // cookie won't be accessible by Javascript on the front end
        // secure: __prod___, // cookie only works in https
        secure: true,
        sameSite: "none", // csrf
      },
    })
  );

  app.set("trust proxy", !__prod___);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: { credentials: true, origin: "https://studio.apollographql.com" },
  });

  app.listen(4000, () => {
    console.log("Server started on host 4000");
  });
};

main();
