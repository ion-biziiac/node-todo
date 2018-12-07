const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret').secret;
const User = require('../models').User;

module.exports = {
  create(req, res, next) {
    req.ability.throwUnlessCan('create', 'User');

    return User
      .create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      })
      .then(user => res.status(201).send({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }))
      .catch(next);
  },

  retrieve(req, res, next) {
    return User
      .findByPk(req.params.userId)
      .then(user => {
        if(user) {
          req.ability.throwUnlessCan('read', user);
  
          return res.status(200).send({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          });
        } else {
          return res.status(404).send({
            message: 'User Not Found'
          });
        }
      })
      .catch(next);
  },
  
  authenticate(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
      where: {
        email: email 
      },
    }).then(user => {
      if(user) {
        if(user.validPassword(password)) {
          const token = jwt.sign({ email: user.email }, jwtSecret, {
            expiresIn: '1d'
          });
          return res.status(200).send({
            token: 'JWT ' + token,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            }
          });
        } else {
          return res.status(400).send({
            message: 'Wrong Password',
          });
        }
      } else {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
    }).catch(next);
  },

  profile(req, res, next) {
    return User.findOne({
      where: {
        email: req.user.email
      },
    }).then(user => {
      if(user) {
        req.ability.throwUnlessCan('read', user);

        return res.status(200).send({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        });
      } else {
        return res.status(404).send({
          message: 'User Not Found'
        });
      }
    }).catch(next);
  }
};
