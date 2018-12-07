const { Todo, TodoItem } = require('../models');

module.exports = {
  create(req, res, next) {
    return Todo
      .findByPk(req.params.todoId)
      .then(todo => {
        if (!todo) {
          return res.status(404).send({
            message: 'Todo Not Found'
          });
        }
        
        req.ability.throwUnlessCan('update', todo);

        return TodoItem
          .create({
            content: req.body.content,
            todoId: todo.id
          })
          .then(todoItem => res.status(201).send(todoItem));
      })
      .catch(next);
  },

  update(req, res, next) {
    return TodoItem
      .findOne({
          where: {
            id: req.params.todoItemId,
            todoId: req.params.todoId,
          },
          include: [{
            model: Todo,
            as: 'todo'
          }]
        })
      .then(todoItem => {
        if (!todoItem) {
          return res.status(404).send({
            message: 'TodoItem Not Found',
          });
        }

        req.ability.throwUnlessCan('update', todoItem);

        return todoItem
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedTodoItem => res.status(200).send(updatedTodoItem))
          .catch(error => res.status(400).send({ message: error.message }));
      })
      .catch(next);
  },
  
  destroy(req, res, next) {
    return TodoItem
      .findOne({
          where: {
            id: req.params.todoItemId,
            todoId: req.params.todoId,
          },
          include: [{
            model: Todo,
            as: 'todo'
          }]
        })
      .then(todoItem => {
        if (!todoItem) {
          return res.status(404).send({
            message: 'TodoItem Not Found',
          });
        }

        req.ability.throwUnlessCan('delete', todoItem);
  
        return todoItem
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send({ message: error.message }));
      })
      .catch(next);
  }
};
