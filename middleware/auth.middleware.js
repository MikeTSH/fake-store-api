const {StatusCodes} = require('http-status-codes');
const { asyncVerify } = require('../misc/jwt.js');
const User = require("../model/user");

const AUTH_HEADER_FORMAT = "Authorization";

const authMiddleware = async (
    req,
    res,
    next
) => {
    try {
        const tokenString = req.header(AUTH_HEADER_FORMAT) || "";
        const token = tokenString.split(" ")[1];

        if (token) {
            const tokenUser = await asyncVerify(token);
            const user = await User.findOne({
                id: tokenUser.id,
            })
            console.log(user)
            if (!user) {
                return next({
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    msg: "User not found"
                });
            }
            res.locals.user = user.toJSON();

            return next();
        }
        return next({
            code: StatusCodes.FORBIDDEN,
            msg: "Authorization required"
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    authMiddleware
}
