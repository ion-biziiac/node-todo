const abilityToQuery = require('../lib/caslSequelize');

module.exports = (sequelize, DataTypes) => {
  const TodoItem = sequelize.define('TodoItem', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { 
        len: {
          args: [1, 255],
          msg: 'Content should be between 1 and 255 characters'
        }
      }
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    scopes: {
      accessibleBy(ability, action = 'read') {
        return { where: abilityToQuery(ability, 'Todo') }
      }
    }
  });

  TodoItem.associate = (models) => {
    TodoItem.belongsTo(models.Todo, {
      foreignKey: 'todoId',
      as: 'todo',
      onDelete: 'CASCADE'
    });
  };

  return TodoItem;
};
