const bcrypt = require('bcrypt-nodejs');
const abilityToQuery = require('../lib/caslSequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING
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
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'admin', 'disabled'],
      defaultValue: 'user'
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Todo, {
      foreignKey: 'userId',
      as: 'todos'
    });
  };

  User.prototype.isAdmin = () => {
    return this.role === 'admin';
  };

  User.prototype.isUser = () => {
    return this.role === 'user';
  };

  User.prototype.isDisabled = () => {
    return this.role === 'disabled';
  };

  User.prototype.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
  };

  User.addHook('beforeCreate', (user) => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });

  User.prototype.toJSON = () => {
    let values = Object.assign({}, this.get());
  
    delete values.password;
    return values;
  };

  return User;
};
