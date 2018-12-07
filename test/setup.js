process.env.NODE_ENV = 'test';

const map = require('lodash/map');
const models = require('../server/models');
const factories = require('./factories');
const pry = require('pryjs');
const chai = require('chai');
const chaiHttp = require('chai-http');

const dbCleaner = () => {
  return Promise.all(
    map(Object.keys(models), (key) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return models[key].destroy({ 
        where: {}, 
        truncate: true, 
        cascade: true, 
        force: true 
      });
    })
  );
};

const loginUser = async(app, user) => {
  return await chai
                 .request(app)
                 .post('/api/authenticate')
                 .send({
                   email: user.email,
                   password: 'password'
                 })
                 .then((res) => { 
                   return res.body.token 
                 });
};

chai.use(chaiHttp);
global.factories = factories;
global.pry = pry;
global.chai = chai
global.expect = chai.expect;
global.dbCleaner = dbCleaner;
global.loginUser = loginUser;
