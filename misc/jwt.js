const {verify, sign} = require('jsonwebtoken');

const KEY = "c5adbb33-2c30-4c4f-ba09-d7b57364f769";

const asyncSign = (
    payload,
) =>
    new Promise((resolve, reject) => {
        sign(payload, KEY, {}, (error, encoded) => {
            if (error) {
                reject(error);
            }

            return resolve(encoded);
        });
    });

const asyncVerify = (
    token,
) =>
    new Promise((resolve, reject) => {
        verify(token, KEY, (error, payload) => {
            if (error) {
                reject(error);
            }

            return resolve(payload);
        });
    });

module.exports = {
    asyncSign,
    asyncVerify
}
