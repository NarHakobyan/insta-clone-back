'use strict';

import { Context } from 'koa';
import { AuthenticationError } from 'apollo-server';

import { User } from '../entity/User';
import { Crypto } from '../utils/crypto';

export const authMiddleware = async (resolve, root, args, ctx: Context, info) => {
    const mutationField = info.schema.getMutationType();

    // this should not really happen
    if (!mutationField) {
        return;
    }

    const mutationDefinition = mutationField.getFields()[info.fieldName];

    if (mutationDefinition && mutationDefinition.auth) {
        const token = (ctx.headers['authorization'] || '').trim().replace('Bearer ', '');

        if (!token) {
            throw new AuthenticationError('unauthorized');
        }

        try {
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

    return resolve(root, args, ctx, info);
};
