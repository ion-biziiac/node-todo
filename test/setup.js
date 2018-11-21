process.env.NODE_ENV = 'test';

const map = require('lodash/map');
const models = require('../server/models');
const factories = require('./factories');
const pry = require('pryjs');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

function dbCleaner() {
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
}

global.factories = factories;
global.pry = pry;
global.chai = chai
global.expect = chai.expect;
global.dbCleaner = dbCleaner
