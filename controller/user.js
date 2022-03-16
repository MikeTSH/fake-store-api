const User = require('../model/user')
const {StatusCodes} = require('http-status-codes');

function stripPassword(user) {
    const {password, ...rest} = user.toJSON ? user.toJSON() : user;
    return rest;
}

module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  User.find().select(['-_id']).limit(limit).sort({
      id: sort
    })
    .then(users => {
      res.json(users.map(stripPassword))
    })
    .catch(err => console.log(err))
}

module.exports.getUser = (req, res) => {
  const id = req.params.id

  User.findOne({
      id
    }).select(['-_id'])
    .then(user => {
      res.json(stripPassword(user))
    })
    .catch(err => console.log(err))
}

module.exports.me = (req, res, next) => {
    if(!res.locals.user) {
        next({
            code: StatusCodes.NOT_FOUND,
            msg: "User not found"
        })
    }
    const {_id, ...cleanUser} = res.locals.user;
    return res.json(stripPassword(cleanUser))
}



module.exports.addUser = (req, res, next) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined"
    })
  } else {

    let userCount = 0;
    User.find().countDocuments(function (err, count, next) {
        userCount = count
      })
      .then(() => {
        const user = new User({
          id: userCount + 1,
      email:req.body.email,
      username:req.body.username,
      password:req.body.password,
      name:{
          firstname:req.body?.firstname,
          lastname:req.body?.lastname
      },
      address:{
          city:req.body?.address?.city,
          street:req.body?.address?.street,
          number:req.body?.number,
          zipcode:req.body?.zipcode,
          geolocation:{
              lat:req.body?.geolocation?.lat,
              long:req.body?.geolocation?.long
          }
      },
      phone:req.body.phone
        })
        user.save()
          .then(user => res.json(user))
          .catch(err => {
              return next({
                  code: StatusCodes.INTERNAL_SERVER_ERROR,
                  msg: "Couldn't create"
              });
          })
      })




    //res.json({id:User.find().count()+1,...req.body})
  }
}

module.exports.editUser = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
    })
  } else {
    res.json({
      id: req.params.id,
      email:req.body.email,
      username:req.body.username,
      password:req.body.password,
      name:{
          firstname:req.body.firstname,
          lastname:req.body.lastname
      },
      address:{
          city:req.body.address.city,
          street:req.body.address.street,
          number:req.body.number,
          zipcode:req.body.zipcode,
          geolocation:{
              lat:req.body.geolocation.lat,
              long:req.body.geolocation.long
          }
      },
      phone:req.body.phone
    })
  }
}

module.exports.deleteUser = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided"
    })
  } else {
    User.findOne({id:req.params.id})
    .select(['-_id'])
      .then(user => {
        res.json(user)
      })
      .catch(err=>console.log(err))
  }
}
