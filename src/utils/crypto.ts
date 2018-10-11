'use strict';

import * as jwt from 'jsonwebtoken';

export class Crypto {
    /**
     * generate jwt token
     * @param {string | Buffer | object} payload
     * @return {Promise<string>}
     */
    static sign(payload: string | Buffer | object): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            jwt.sign(payload, 'secret' /* todo add to configs */, (err, token) => {
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            });
        });
    }

    /**
     * verify jwt token
     * @param {string} token
     * @return {Promise<object | string>}
     */
    static verify(token: string): Promise<object | string> {
        return new Promise<object | string>((resolve, reject) => {
            jwt.verify(token, 'secret' /* todo add to configs */, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                return resolve(decoded);
            });
        });
    }
}
