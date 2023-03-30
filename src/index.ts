import { createYoga, createSchema, YogaInitialContext } from "graphql-yoga";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import { createServer } from "http";

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        cookie(name: String): String
      }
      type Mutation {
        setCookie(name: String, value: String): String
      }
    `,
    resolvers: {
      Query: {
        async cookie(root, args, ctx: YogaInitialContext) {
          const cookie = await ctx.request.cookieStore?.get(args.name);
          return cookie?.value;
        },
      },
      Mutation: {
        async setCookie(root, args, ctx: YogaInitialContext) {
          await ctx.request.cookieStore?.set(args.name, args.value);
          return args.value;
        },
      },
    },
  }),
  plugins: [useCookies()],
});

const server = createServer(yoga);
server.listen(4009, () => {
  console.log("Server is running on http://localhost:4009");
});
