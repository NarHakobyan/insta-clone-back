import * as Koa from 'koa';
import * as path from 'path';
import { createConnection } from 'typeorm';
import { makeExecutableSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server-koa';
import { mergeTypes, fileLoader, mergeResolvers } from 'merge-graphql-schemas';

import { logger } from './utils/logger';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

export const startServer = async port => {
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const server = new ApolloServer({ schema });

    await createConnection();

    const app = new Koa();
    server.applyMiddleware({ app });

    app.listen({ port }, () => {
        console.clear();
        return logger.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
};
