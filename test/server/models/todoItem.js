const { Todo, TodoItem } = require('../../../server/models');
let user;

describe('server/models/todoItem', () => {
  beforeEach(async() => {
    user = await factories.create('user');
  });

  afterEach((done) => {
    dbCleaner().then(done());
  });

  describe('Create TodoItem', () => {
    it('should create a TodoItem', async() => {
      const todo = await factories.create('todo', { userId: user.id });
      await TodoItem
        .create({
          content: 'New Todo Item',
          complete: true,
          todoId: todo.id
        })
        .then(todoItem => {
          expect(todoItem.content).to.eql('New Todo Item');
        });
    });

    it('should validate content presence', async() => {
      await TodoItem
        .build()
        .validate()
        .catch(error => {
          expect(error.message).to.eql('notNull Violation: TodoItem.content cannot be null');
        });
    });

    it('should validate content length', async() => {
      await TodoItem
        .build({
          content: ''
        })
        .validate()
        .catch(error => {
          expect(error.message).to.eql('Validation error: Content should be between 1 and 255 characters');
        });
    });
  });

  describe('Update TodoItem', () => {
    it('should update a TodoItem', async() => {
      const todo = await factories.create('todo', { userId: user.id });
      await TodoItem.create({ 
        content: 'New Todo Item',
        todoId: todo.id
      }).then(todoItem => {
        return todoItem.update({
          content: 'Updated Todo Item'
        })
      }).then(todoItem => {
        expect(todoItem.content).to.eql('Updated Todo Item');
      });
    });
  });

  describe('Delete TodoItem', () => {
    it('should delete a TodoItem', async() => {
      const todo = await factories.create('todo', { userId: user.id });
      const todoItem = await TodoItem.create({ 
        content: 'New Todo Item',
        todoId: todo.id
      });
      
      let todoItems = await TodoItem.findAll();
      expect(todoItems.length).to.eql(1);
      await todoItem.destroy();
      todoItems = await TodoItem.findAll();
      expect(todoItems.length).to.eql(0);
    });
  });

  describe('Associations', () => {
    it('should create TodoItem with Todo', async() => {
      await TodoItem.create({ 
        content: 'Content',
        todo: { 
          title: 'Title',
          userId: user.id
        }
      }, {
        include: {
          model: Todo,
          as: 'todo'
        }
      }).then(todoItem => {
        expect(todoItem.content).to.eql('Content');
        expect(todoItem.todo.title).to.eql('Title');
      });
    });

    it('should delete TodoItem without Todo', async() => {
      const todoItem = await TodoItem.create({ 
        content: 'Content',
        todo: { 
          title: 'Title',
          userId: user.id
        }
      }, {
        include: {
          model: Todo,
          as: 'todo'
        }
      });
      await todoItem
        .destroy()
        .then(async() => {
          let todoItems = await TodoItem.findAll();
          let todos = await Todo.findAll();
          expect(todoItems.length).to.eql(0);
          expect(todos.length).to.eql(1);
        });
    });
  });
});
