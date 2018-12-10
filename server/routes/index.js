const passport = require('../config/passport');
const createAbilities = require('../middleware/abilities');
const errorHandler = require('../middleware/errorHandler');
const { users, todos, todoItems } = require('../controllers');

module.exports = (app) => {
  app.use(passport.initialize());

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));
  app.post('/api/authenticate', users.authenticate);

  app.use(passport.authenticate('jwt', { session: false }), createAbilities);

  // user routes
  app.get('/api/users', users.list);
  app.get('/api/profile', users.profile);
  app.get('/api/users/:userId', users.retrieve);
  app.post('/api/users', users.create);
  app.put('/api/users/:userId', users.update);
  app.delete('/api/users/:userId', users.destroy);

  // todo routes
  app.get('/api/todos', todos.list);
  app.get('/api/todos/:todoId', todos.retrieve);
  app.post('/api/todos', todos.create);
  app.put('/api/todos/:todoId', todos.update);
  app.delete('/api/todos/:todoId', todos.destroy);
  app.post('/api/todos/:todoId/items', todoItems.create);
  app.put('/api/todos/:todoId/items/:todoItemId', todoItems.update);
  app.delete('/api/todos/:todoId/items/:todoItemId', todoItems.destroy);

  // handle http errors
  app.use(errorHandler);
};
