'use strict';

import { Context } from 'koa';
import isEmpty = require('lodash/isEmpty');
import { UserInputError } from 'apollo-server';

import serializeValidationError from '../utils/serializeValidationError';

export const inputValidationMiddleware = async (resolve, parent, args, ctx: Context, info) => {
    const mutationField = info.schema.getMutationType();
    const mutationDefinition = mutationField.getFields()[info.fieldName];

    if (!isEmpty(parent) || !mutationDefinition) {
        return resolve(parent, args, ctx, info);
    }

    const mutationValidationSchema = mutationDefinition.validationSchema;

    const schema =
        typeof mutationValidationSchema === 'function'
            ? mutationValidationSchema(parent, args, ctx, info)
            : mutationValidationSchema;

    try {
        const values = await schema.validate(args, {
            recursive: true,
            abortEarly: false
        });
        return resolve(parent, values, ctx, info);
    } catch (error) {
        const errorResult = serializeValidationError(error);
        throw new UserInputError(errorResult.message, errorResult.details);
    }
};
