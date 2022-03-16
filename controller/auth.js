const User = require("../model/user");
const {StatusCodes} = require('http-status-codes');
const { asyncSign } = require('../misc/jwt.js');

module.exports.login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    try {
      const user = await User.findOne({
        username,
      })
      if (!user) {
        res.json({
          status: "Error",
          msg: "username or password is incorrect",
        });
      } else {
        const token = await asyncSign({
          id: user.id
        })
        res.json({
          token,
        });
      }
    } catch (e) {
      return next({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: "Something went wrong"
      });
    }
  }
};
