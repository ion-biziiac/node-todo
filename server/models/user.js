const bcrypt = require('bcrypt-nodejs');
const abilityToQuery = require('../lib/caslSequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { 
        len: {
          args: [1, 255],
          msg: 'FirstName should be between 1 and 255 characters'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { 
        len: {
          args: [6, 255],
          msg: 'Password should be between 6 and 255 characters'
        }
      }
    },
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'admin', 'disabled'],
      defaultValue: 'user'
    }
  }, {
    scopes: {
      accessibleBy(ability, action = 'read') {
        return { where: abilityToQuery(ability, 'User') }
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Todo, {
      foreignKey: 'userId',
      as: 'todos'
    });
  };

  User.prototype.isAdmin = function() {
    return this.role === 'admin';
  };

  User.prototype.isUser = function() {
    return this.role === 'user';
  };

  User.prototype.isDisabled = function() {
    return this.role === 'disabled';
  };

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());
  
    delete values.password;
    return values;
  };

  User.addHook('beforeCreate', (user) => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });

  User.addHook('beforeUpdate', (user) => {
    if(user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });

  return User;
};
