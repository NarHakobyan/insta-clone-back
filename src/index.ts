import * as Koa from 'koa';
import { createConnection } from 'typeorm';
import { ApolloServer, gql } from 'apollo-server-koa';

import { logger } from './utils/logger';

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world2!'
    }
};

export const startServer = async port => {
    const server = new ApolloServer({ typeDefs, resolvers });

    await createConnection();

    const app = new Koa();
    server.applyMiddleware({ app });

    app.listen({ port }, () => {
        console.clear();
        return logger.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
};
