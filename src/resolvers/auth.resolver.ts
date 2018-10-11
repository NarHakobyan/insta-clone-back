'use strict';

import * as yup from 'yup';
import { classToPlain } from 'class-transformer';
import { ValidationError, UserInputError } from 'apollo-server-errors';

import { User } from '../entity/User';

interface Login {
    email: string;
    password: string;
}

interface Register {
    fistName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
}

export default {
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
        async register(_: any, params: Register) {
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
};
