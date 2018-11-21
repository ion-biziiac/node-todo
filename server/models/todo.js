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
    },
  });

  Todo.associate = (models) => {
    Todo.hasMany(models.TodoItem, {
      foreignKey: 'todoId',
      as: 'todoItems'
    });
  };

  return Todo;
};
