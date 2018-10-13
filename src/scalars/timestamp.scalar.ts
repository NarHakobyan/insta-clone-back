'use strict';

import * as dayjs from 'dayjs';
import { GraphQLScalarType, Kind } from 'graphql';

export default {
    Timestamp: new GraphQLScalarType({
        name: 'Timestamp',
        description: 'Timestamp custom scalar type',
        parseValue(value: number) {
            return dayjs(value).toDate();
        },
        serialize(value: Date) {
            return value.valueOf();
        },
        parseLiteral(ast: any) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        }
    })
};
