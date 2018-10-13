import * as Koa from 'koa';
import * as path from 'path';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-koa';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import { yupMiddleware, MutationValidationError, FieldValidationError } from 'graphql-yup-middleware';

import { authMiddleware } from './middlewares/auth.middleware';
import { logger } from './utils/logger';

const typeDefs = mergeTypes(
    [MutationValidationError, FieldValidationError, ...fileLoader(path.join(__dirname, './schemas'))],
    { all: true }
);
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

export const startServer = async port => {
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const schemaWithMiddleware = applyMiddleware(schema, yupMiddleware(), authMiddleware);
    const server = new ApolloServer({ schema: schemaWithMiddleware, context: context => context.ctx });

    await createConnection();

    const app = new Koa();
    server.applyMiddleware({ app });

    app.listen({ port }, () => {
        console.clear();
        return logger.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
};
