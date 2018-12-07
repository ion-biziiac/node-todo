const { Todo, TodoItem } = require('../models');

module.exports = {
  list(req, res, next) {
    req.ability.throwUnlessCan('read', 'Todo');

    return Todo
      .scope({ 
        method: ['accessibleBy', req.ability] 
      })
      .findAll({
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }]
      })
      .then(todos => {
        res.status(200).send(todos);
      })
      .catch(next);
  },

  retrieve(req, res, next) {
    return Todo
      .findByPk(req.params.todoId, {
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }]
      })
      .then(todo => {
        if (!todo) {
          return res.status(404).send({
            message: 'Todo Not Found'
          });
        }

        req.ability.throwUnlessCan('read', todo);

        return res.status(200).send(todo);
      })
      .catch(next);
  },

  create(req, res, next) {
    req.ability.throwUnlessCan('create', 'Todo');

    return Todo
      .create({
        title: req.body.title,
        userId: req.user.id
      })
      .then(todo => res.status(201).send(todo))
      .catch(next);
  },

  update(req, res, next) {
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

        req.ability.throwUnlessCan('update', todo);

        return todo
          .update({
            title: req.body.title || todo.title,
          })
          .then(() => res.status(200).send(todo))
          .catch(next);
      })
      .catch(next);
  },

  destroy(req, res, next) {
    return Todo
      .findByPk(req.params.todoId)
      .then(todo => {
        if (!todo) {
          return res.status(400).send({
            message: 'Todo Not Found',
          });
        }

        req.ability.throwUnlessCan('delete', todo);

        return todo
          .destroy()
          .then(() => res.status(204).send());
      })
      .catch(next);
  }
};
