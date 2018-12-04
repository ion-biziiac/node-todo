const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret').secret;
const User = require('../models').User;

module.exports = {
  create(req, res) {
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
      .catch(error => res.status(400).send({ message: error.message }));
  },

  retrieve(req, res) {
    return User
      .findByPk(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found'
          });
        }
        return res.status(200).send({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        });
      })
      .catch(error => res.status(400).send({ message: error.message }));
  },
  
  authenticate(req, res) {
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
            expiresIn: 604800 // 1 week
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
    }).catch(error => {
      return res.status(400).send({ message: error.message });
    });
  },

  logout(req, res) {
    req.logout();
    return res.status(200).send({ message: 'Signed out successfully' });
  },

  profile(req, res) {
    return User.findOne({
      where: {
        email: req.user.email
      },
    }).then(user => {
      if(user) {
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
    }).catch(error => {
      return res.status(400).send({ message: error.message });
    });
  }
};
