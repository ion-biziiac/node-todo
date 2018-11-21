process.env.NODE_ENV = 'test';
const factoryGirl = require('factory-girl');
const factory = factoryGirl.factory;

const Todo = require('../server/models').Todo;
const TodoItem = require('../server/models').TodoItem;

factory.define('todo', Todo, {
  title: factory.seq('Todo.title', (n) => `My Todo ${n}`)
});

factory.extend('todo', 'todoWithItems', { 
  todoItems: factory.assocMany('todoItem', 2, 'id')
});

factory.define('todoItem', TodoItem, {
  content: factory.seq('TodoItem.content', (n) => `My TodoItem content ${n}`)
});

module.exports = factory;
