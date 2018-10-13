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
    const mutationField = info.schema.getMutationType();
    const mutationDefinition = mutationField.getFields()[info.fieldName];

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
