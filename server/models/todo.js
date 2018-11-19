module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { 
        len: {
          args: [0, 255],
          msg: 'Title should be between 5 and 40 characters'
        }
      }
    },
  });

  Todo.associate = (models) => {
    Todo.hasMany(models.TodoItem, {
      foreignKey: 'todoId',
      as: 'todoItems',
    });
  };

  return Todo;
};
