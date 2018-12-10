process.env.NODE_ENV = 'test';
const factoryGirl = require('factory-girl');
const factory = factoryGirl.factory;
const { Todo, TodoItem, User } = require('../server/models');

factory.define('user', User, {
  firstName: factory.seq('User.firstName', (n) => `John ${n}`),
  lastName: factory.seq('User.flastName', (n) => `Doe ${n}`),
  email: factory.seq('User.email', (n) => `user${n}@mail.com`),
  password: 'password',
  role: 'user'
});

factory.extend('user', 'admin', { 
  role: 'admin'
});

factory.extend('user', 'disabledUser', { 
  role: 'disabled'
});

factory.define('todo', Todo, {
  title: factory.seq('Todo.title', (n) => `My Todo ${n}`)
});

factory.extend('todo', 'todoWithItems', { 
  todoItems: factory.assocMany('todoItem', 2, 'id')
});

factory.define('todoItem', TodoItem, {
  //todo: factory.assoc('todo', 'id'),
  content: factory.seq('TodoItem.content', (n) => `My TodoItem content ${n}`)
});

module.exports = factory;
