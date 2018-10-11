'use strict';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export class Crypto {
    /**
     * encode jwt token
     * @param {string | Buffer | object} payload
     * @return {Promise<string>}
     */
    static encodeJwt(payload: string | Buffer | object): Promise<string> {
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
     * decode jwt token
     * @param {string} token
     * @return {Promise<object | string>}
     */
    static decodeJwt(token: string): Promise<object | string> {
        return new Promise<object | string>((resolve, reject) => {
            jwt.verify(token, 'secret' /* todo add to configs */, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                return resolve(decoded);
            });
        });
    }

    /**
     * generate password has
     * @param {string} password
     * @return {Promise<string>}
     */
    static generateHash(password: string) {
        return bcrypt.hash(password, 10 /* todo generate password hash */);
    }

    /**
     * compare password with hash
     * @param {string} password
     * @param {string} hash
     * @return {Promise<boolean>}
     */
    static compareHash(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }
}
