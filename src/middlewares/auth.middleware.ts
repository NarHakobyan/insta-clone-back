'use strict';

import { Context } from 'koa';
import isEmpty = require('lodash/isEmpty');
import { AuthenticationError } from 'apollo-server';

import { User } from '../entity/User';
import { Crypto } from '../utils/crypto';

export const authMiddleware = async (resolve, parent, args, ctx: Context, info) => {
    if (!isEmpty(parent)) {
        return resolve(parent, args, ctx, info);
    }
    const mutationType = info.schema.getMutationType();
    const queryType = info.schema.getQueryType();

    const fields = {
        ...mutationType.getFields(),
        ...queryType.getFields()
    };
    const mutationDefinition = fields[info.fieldName];

    if (mutationDefinition && mutationDefinition.auth) {
        try {
            const token = ctx.headers['authorization'].replace('Bearer ', '');
            const data = await Crypto.decodeJwt<{ id: string }>(token);
            const user = await User.findOne(data.id);

            ctx.state.auth = {
                user,
                data,
                token
            };
        } catch (e) {
            throw new AuthenticationError('unauthorized');
        }
    }

    return resolve(parent, args, ctx, info);
};
