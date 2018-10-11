'use strict';

import { classToPlain } from 'class-transformer';
import { ValidationError } from 'apollo-server-errors';

import { User } from '../entity/User';
import { Crypto } from '../utils/crypto';

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
        async login(_: any, params: Login) {
            const user = await User.findOne({
                where: {
                    email: params.email
                }
            });

            return user;
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
                token: await Crypto.sign({
                    id: user.id
                })
            };
        }
    }
};
