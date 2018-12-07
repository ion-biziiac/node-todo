const abilityToQuery = require('../lib/caslSequelize');

module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { 
        len: {
          args: [1, 255],
          msg: 'Title should be between 1 and 255 characters'
        }
      }
    }
  }, {
    scopes: {
      accessibleBy(ability, action = 'read') {
        return { where: abilityToQuery(ability, 'Todo') }
      }
    }
  });

  Todo.associate = (models) => {
    Todo.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });

    Todo.hasMany(models.TodoItem, {
      foreignKey: 'todoId',
      as: 'todoItems'
    });
  };

  return Todo;
};
