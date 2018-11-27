const Todo = require('../../../server/models').Todo;
const TodoItem = require('../../../server/models').TodoItem;

describe('server/models/todo', () => {
  afterEach((done) => {
    dbCleaner().then(done());
  });

  describe('Create Todo', () => {
    it('should create a Todo', async() => {
      await Todo
        .create({
          title: 'New Todo'
        })
        .then(todo => {
          expect(todo.title).to.eql('New Todo');
        });
    });

    it('should validate title presence', async() => {
      await Todo
        .create()
        .catch(error => {
          expect(error.message).to.eql('notNull Violation: Todo.title cannot be null');
        });
    });

    it('should validate title length', async() => {
      await Todo
        .create({
          title: ''
        })
        .catch(error => {
          expect(error.message).to.eql('Validation error: Title should be between 1 and 255 characters');
        });
    });
  });

  describe('Update Todo', () => {
    it('should update a Todo', async() => {
      await Todo.create({ 
        title: 'New Todo' 
      }).then(todo => {
        return todo.update({
          title: 'Updated Todo'
        })
      }).then(todo => {
        expect(todo.title).to.eql('Updated Todo');
      });
    });
  });

  describe('Delete Todo', () => {
    it('should delete a Todo', async() => {
      const todo = await Todo.create({ title: 'New Todo' });
      
      let todos = await Todo.findAll();
      expect(todos.length).to.eql(1);
      await todo.destroy();
      todos = await Todo.findAll();
      expect(todos.length).to.eql(0);
    });
  });

  describe('Associations', () => {
    it('should create with Todo Items', async() => {
      const todo = Todo.build({ 
        title: 'Title',
        todoItems: [
          {
            content: 'Item 1',
            complete: true
          },
          {
            content: 'Item 2',
            complete: false
          }
        ]
      }, {
        include: {
          model: TodoItem,
          as: 'todoItems'
        }
      });
      await todo
        .save()
        .then(todo => {
          expect(todo.todoItems.length).to.eql(2);
          expect(todo.todoItems[0].content).to.eql('Item 1');
          expect(todo.todoItems[0].complete).to.eql(true);
          expect(todo.todoItems[1].content).to.eql('Item 2');
          expect(todo.todoItems[1].complete).to.eql(false);
        });
    });

    it('should destroy with Todo Items', async() => {
      const todo = await Todo.create({ 
        title: 'Title',
        todoItems: [
          {
            content: 'Item 1',
            complete: true
          },
          {
            content: 'Item 2',
            complete: false
          }
        ]
      }, {
        include: {
          model: TodoItem,
          as: 'todoItems'
        }
      });
      
      let todoItems = await TodoItem.findAll();
      expect(todoItems.length).to.eql(2);
      await todo.destroy();
      todoItems = await TodoItem.findAll();
      expect(todoItems.length).to.eql(0);
    });
  });
});
