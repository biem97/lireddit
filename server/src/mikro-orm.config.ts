import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { __prod___ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  password: "postgres",
  dbName: "lireddit",
  type: "postgresql",
  entities: [Post, User],
  debug: !__prod___,
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];
