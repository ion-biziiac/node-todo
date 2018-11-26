const Todo = require('../models').Todo;
const TodoItem = require('../models').TodoItem;

module.exports = {
  list(req, res) {
    return Todo
      .findAll({
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }],
      })
      .then(todos => res.status(200).send(todos))
      .catch(error => res.status(400).send({ message: error.message }));
  },

  retrieve(req, res) {
    return Todo
      .findByPk(req.params.todoId, {
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }],
      })
      .then(todo => {
        if (!todo) {
          return res.status(404).send({
            message: 'Todo Not Found'
          });
        }
        return res.status(200).send(todo);
      })
      .catch(error => res.status(400).send({ message: error.message }));
  },

  create(req, res) {
    return Todo
      .create({
        title: req.body.title,
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send({ message: error.message }));
  },

  update(req, res) {
    return Todo
      .findByPk(req.params.todoId, {
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }],
      })
      .then(todo => {
        if (!todo) {
          return res.status(404).send({
            message: 'Todo Not Found',
          });
        }
        return todo
          .update({
            title: req.body.title || todo.title,
          })
          .then(() => res.status(200).send(todo))
          .catch((error) => res.status(400).send({ message: error.message }));
      })
      .catch((error) => res.status(400).send({ message: error.message }));
  },

  destroy(req, res) {
    return Todo
      .findByPk(req.params.todoId)
      .then(todo => {
        if (!todo) {
          return res.status(400).send({
            message: 'Todo Not Found',
          });
        }
        return todo
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send({ message: error.message }));
      })
      .catch(error => res.status(400).send({ message: error.message }));
  }
};
