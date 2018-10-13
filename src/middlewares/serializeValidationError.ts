import map = require('lodash/map');
import groupBy = require('lodash/groupBy');
import { GraphQLResolveInfo } from 'graphql';
import { ValidationError, ValidateOptions } from 'yup';

export interface YupMiddlewareErrorContext<TContext = any, TArgs = any> {
    root: any;
    args: TArgs;
    context: TContext;
    info: GraphQLResolveInfo;
}

export interface YupMiddlewareOptions {
    errorPayloadBuilder?: (error: ValidationError, errorContext: YupMiddlewareErrorContext) => Object;
    shouldTransformArgs?: boolean;
    yupOptions?: ValidateOptions;
}

export interface YupMiddlewareFieldValidationError {
    field: string;
    errors: string[];
}

export interface YupMiddlewareDefaultError {
    message: string;
    details: YupMiddlewareFieldValidationError[];
}

export default function serializeValidationError(error: ValidationError): { error: YupMiddlewareDefaultError } {
    let rootError: YupMiddlewareDefaultError = {
        message: error.message,
        details: []
    };

    if (error.inner.length) {
        const errorsGrouped = groupBy(error.inner, 'path');

        const details = Object.keys(errorsGrouped).map(key => ({
            field: key,
            errors: map(errorsGrouped[key], 'message')
        }));

        rootError = {
            ...rootError,
            details
        };
    }

    return {
        error: rootError
    };
}
