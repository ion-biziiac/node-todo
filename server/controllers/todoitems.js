const Todo = require('../models').Todo;
const TodoItem = require('../models').TodoItem;

module.exports = {
  create(req, res) {
    return Todo
      .findByPk(req.params.todoId)
      .then(todo => {
        if (!todo) {
          return res.status(404).send({
            message: 'Todo Not Found'
          });
        }
        return TodoItem
          .create({
            content: req.body.content,
            todoId: todo.id,
          })
          .then(todoItem => res.status(201).send(todoItem))
          .catch(error => res.status(400).send({ message: error.message }));
      })
      .catch(error => res.status(400).send({ message: error.message }));
  },

  update(req, res) {
    return TodoItem
      .findOne({
          where: {
            id: req.params.todoItemId,
            todoId: req.params.todoId,
          },
        })
      .then(todoItem => {
        if (!todoItem) {
          return res.status(404).send({
            message: 'TodoItem Not Found',
          });
        }
  
        return todoItem
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedTodoItem => res.status(200).send(updatedTodoItem))
          .catch(error => res.status(400).send({ message: error.message }));
      })
      .catch(error => res.status(400).send({ message: error.message }));
  },
  
  destroy(req, res) {
    return TodoItem
      .findOne({
          where: {
            id: req.params.todoItemId,
            todoId: req.params.todoId,
          },
        })
      .then(todoItem => {
        if (!todoItem) {
          return res.status(404).send({
            message: 'TodoItem Not Found',
          });
        }
  
        return todoItem
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send({ message: error.message }));
      })
      .catch(error => res.status(400).send({ message: error.message }));
  }
};
