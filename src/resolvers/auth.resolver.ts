'use strict';

import * as yup from 'yup';
import * as dayjs from 'dayjs';
import { classToPlain } from 'class-transformer';
import { ValidationError, UserInputError } from 'apollo-server-errors';

import { User } from '../entity/User';
import { GraphQLScalarType, Kind } from 'graphql';

interface Login {
    email: string;
    password: string;
}

export default {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value: number) {
            console.log(dayjs(value).toDate());
            return dayjs(value).toDate();
        },
        serialize(value: Date) {
            return value.valueOf();
        },
        parseLiteral(ast) {
            debugger;
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        }
    }),
    Query: {
        hello() {
            return 'Hello world2!';
        }
    },
    Mutation: {
        login: {
            validationSchema: yup.object({
                email: yup
                    .string()
                    .required('string.required')
                    .min(2)
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
            auth: true,
            validationSchema: yup.object({
                firstName: yup
                    .string()
                    .required('string.required')
                    .min(2),
                lastName: yup
                    .string()
                    .required('string.required')
                    .min(2),
                dob: yup
                    .date()
                    .max(dayjs().subtract(18, 'year'))
                    .required('integer.required'),
                email: yup
                    .string()
                    .required('string.required')
                    .min(2)
                    .email('email.invalid'),
                password: yup
                    .string()
                    .required('string.required')
                    .min(5)
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
