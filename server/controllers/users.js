const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret').secret;
const User = require('../models').User;

module.exports = {
  list(req, res, next) {
    req.ability.throwUnlessCan('read', 'User');

    return User
      .scope({ 
        method: ['accessibleBy', req.ability] 
      })
      .findAll()
      .then(users => {
        res.status(200).send(users);
      })
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
            role: user.role,
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

  create(req, res, next) {
    req.ability.throwUnlessCan('create', 'User');

    return User
      .create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      })
      .then(user => res.status(201).send({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
      .catch(next);
  },

  update(req, res, next) {
    return User
      .findByPk(req.params.userId)
      .then(user => {
        if (user) {
          req.ability.throwUnlessCan('update', user);

          let userParams = {
            firstName: req.body.firstName || user.firstName,
            lastName: req.body.lastName || user.lastName,
            email: req.body.email || user.email
          };

          if (req.body.role) {
            req.ability.throwUnlessCan('update', user, 'role');
            userParams['role'] = req.body.role;
          } 

          if (req.body.password) {
            userParams['password'] = req.body.password;
          }

          return user
            .update(userParams)
            .then(() => res.status(200).send(user));
        } else {
          return res.status(404).send({
            message: 'User Not Found'
          });
        }
      })
      .catch(next);
  },

  destroy(req, res, next) {
    return User
      .findByPk(req.params.userId)
      .then(user => {
        if (user) {
          req.ability.throwUnlessCan('delete', user);

          return user
            .destroy()
            .then(() => res.status(204).send());
        } else {
          return res.status(400).send({
            message: 'User Not Found',
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
              lastName: user.lastName,
              role: user.role
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
          role: user.role,
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
