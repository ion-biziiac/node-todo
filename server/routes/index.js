const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;
const usersController = require('../controllers').users;
const isAuthenticated = require('../middleware/isAuthenticated');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  // user routes
  app.post('/api/users', isAuthenticated, usersController.create);
  app.post('/api/authenticate', usersController.authenticate);
  app.get('/api/logout', isAuthenticated, usersController.logout);
  app.get('/api/profile', isAuthenticated, usersController.profile);
  app.get('/api/users/:userId', isAuthenticated, usersController.retrieve);

  // todo routes
  app.get('/api/todos', isAuthenticated, todosController.list);
  app.get('/api/todos/:todoId', isAuthenticated, todosController.retrieve);
  app.post('/api/todos', isAuthenticated, todosController.create);
  app.put('/api/todos/:todoId', isAuthenticated, todosController.update);
  app.delete('/api/todos/:todoId', isAuthenticated, todosController.destroy);
  app.post('/api/todos/:todoId/items', isAuthenticated, todoItemsController.create);
  app.put('/api/todos/:todoId/items/:todoItemId', isAuthenticated, todoItemsController.update);
  app.delete('/api/todos/:todoId/items/:todoItemId', isAuthenticated, todoItemsController.destroy);
};
