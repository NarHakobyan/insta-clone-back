'use strict';

import * as yup from 'yup';
import { Context } from 'koa';
import { Story } from '../entity/Story';

interface NewStory {
    title: string;
    description: string;
}

export default {
    Query: {},
    Mutation: {
        addStory: {
            auth: true,
            validationSchema: () =>
                yup.object({
                    newStory: yup.object({
                        title: yup
                            .string()
                            .min(5)
                            .required('string.required'),
                        description: yup
                            .string()
                            .min(5)
                            .required('string.required')
                    })
                }),
            async resolve(_: any, params: { newStory: NewStory }, ctx: Context) {
                return Story.create({
                    author: ctx.state.auth.user,
                    ...params.newStory
                }).save();
            }
        }
    }
};
