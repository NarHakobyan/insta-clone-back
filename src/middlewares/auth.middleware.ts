'use strict';

export const authMiddleware = async (resolve, root, args, context, info) => {
    const result = await resolve(root, args, context, info);
    return result;
};
