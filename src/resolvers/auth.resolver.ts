'use strict';

import * as yup from 'yup';
import { Context } from 'koa';
import * as dayjs from 'dayjs';
import { classToPlain } from 'class-transformer';
import { ValidationError, UserInputError } from 'apollo-server-errors';

import { User } from '../entity/User';

interface Login {
    email: string;
    password: string;
}

export default {
    Query: {
        me: {
            auth: true,
            resolve(_: any, __: any, ctx: Context) {
                return classToPlain(ctx.state.auth.user);
            }
        }
    },
    Mutation: {
        login: {
            validationSchema: () =>
                yup.object({
                    email: yup
                        .string()
                        .required('string.required')
                        .email('email.invalid'),
                    password: yup
                        .string()
                        .required('string.required')
                        .min(5)
                }),
            async resolve(_: any, params: Login) {
                const user = await User.findOne({
                    where: {
                        email: params.email
                    }
                });

                let passwordValid;
                if (user) {
                    passwordValid = await user.comparePassword(params.password);
                }

                if (!(user && passwordValid)) {
                    throw new UserInputError('notfound');
                }

                return {
                    user: classToPlain(user),
                    token: await user.generateToken()
                };
            }
        },
        register: {
            validationSchema: () =>
                yup.object({
                    firstName: yup
                        .string()
                        .required('string.required')
                        .min(2, 'err.min_length'),
                    lastName: yup
                        .string()
                        .required('err.required')
                        .min(2, 'err.min_length'),
                    dob: yup
                        .date()
                        .max(dayjs().subtract(18, 'year'))
                        .required('err.required'),
                    email: yup
                        .string()
                        .required('err.required')
                        .email('email.invalid'),
                    password: yup
                        .string()
                        .required('err.required')
                        .min(5, 'err.min_length')
                }),
            async resolve(_: any, params: User) {
                const existingUser = await User.findOne({
                    where: {
                        email: params.email
                    }
                });

                if (existingUser) {
                    throw new ValidationError('email.unique');
                }
                const user = await User.create(params).save();

                return {
                    user: classToPlain(user),
                    token: await user.generateToken()
                };
            }
        }
    }
};
