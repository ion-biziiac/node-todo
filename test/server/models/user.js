const { User, Todo, TodoItem } = require('../../../server/models');

describe('server/models/user', () => {
  afterEach((done) => {
    dbCleaner().then(done());
  });

  describe('Create User', () => {
    it('should create an User', async() => {
      await User
        .create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'user@email.com',
          role: 'user',
          password: 'password'
        })
        .then(user => {
          expect(user.firstName).to.eql('John');
          expect(user.lastName).to.eql('Doe');
          expect(user.email).to.eql('user@email.com');
          expect(user.role).to.eql('user');
          expect(user.password).to.not.eql('password');
        });
    });

    it('should validate firstName presence', async() => {
      await User
        .create({ 
          email: 'user@email.com',
          role: 'user',
          password: 'password'
        })
        .catch(error => {
          expect(error.message).to.eql('notNull Violation: User.firstName cannot be null');
        });
    });

    it('should validate firstName length', async() => {
      await User
        .create({ 
          firstName: '',
          lastName: 'Doe',
          email: 'user@email.com',
          role: 'user',
          password: 'password'
        })
        .catch(error => {
          expect(error.message).to.eql('Validation error: FirstName should be between 1 and 255 characters');
        });
    });

    it('should validate email presence', async() => {
      await User
        .create({ 
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          password: 'password'
        })
        .catch(error => {
          expect(error.message).to.eql('notNull Violation: User.email cannot be null');
        });
    });

    it('should validate email format', async() => {
      await User
        .create({ 
          email: 'dummy',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          password: 'password'
        })
        .catch(error => {
          expect(error.message).to.eql('Validation error: Validation isEmail on email failed');
        });
    });

    it('should validate password presence', async() => {
      await User
        .create({ 
          email: 'test@mail.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user'
        })
        .catch(error => {
          expect(error.message).to.eql('notNull Violation: User.password cannot be null');
        });
    });

    it('should validate password length', async() => {
      await User
        .create({ 
          email: 'test@mail.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          password: 'pass'
        })
        .catch(error => {
          expect(error.message).to.eql('Validation error: Password should be between 6 and 255 characters');
        });
    });

    it('should validate role in [admin, user, disabled]', async() => {
      await User
        .create({ 
          email: 'test@mail.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'dummy',
          password: 'password'
        })
        .catch(error => {
          expect(error.message).to.eql('invalid input value for enum "enum_Users_role": "dummy"');
        });
    });
  });

  describe('Update User', () => {
    it('should update an User', async() => {
      const user = await factories.create('user');
      await user.update({
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@email.com',
        role: 'user',
        password: 'password'
      }).then(user => {
        expect(user.firstName).to.eql('John');
        expect(user.lastName).to.eql('Doe');
        expect(user.email).to.eql('user@email.com');
        expect(user.role).to.eql('user');
        expect(user.password).to.not.eql('password');
      });
    });
  });

  describe('Delete User', () => {
    it('should delete an User', async() => {
      const user = await factories.create('user');
      
      let users = await User.findAll();
      expect(users.length).to.eql(1);
      await user.destroy();
      users = await User.findAll();
      expect(users.length).to.eql(0);
    });
  });

  describe('Associations', () => {
    it('should create with Todos and Todo Items', async() => {
      const user = User.build({
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@email.com',
        role: 'user',
        password: 'password',
        todos: [
          {
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
          }
        ]
      }, {
        include: {
          model: Todo,
          as: 'todos',
          include: {
            model: TodoItem,
            as: 'todoItems'
          }
        }
      });
      
      await user
        .save()
        .then(user => {
          expect(user.todos.length).to.eql(1);
          expect(user.todos[0].title).to.eql('Title');
          expect(user.todos[0].todoItems.length).to.eql(2);
          expect(user.todos[0].todoItems[0].content).to.eql('Item 1');
          expect(user.todos[0].todoItems[0].complete).to.eql(true);
          expect(user.todos[0].todoItems[1].content).to.eql('Item 2');
          expect(user.todos[0].todoItems[1].complete).to.eql(false);
        });
    });

    it('should destroy with Todos and Todo Items', async() => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@email.com',
        role: 'user',
        password: 'password',
        todos: [
          {
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
          }
        ]
      }, {
        include: {
          model: Todo,
          as: 'todos',
          include: {
            model: TodoItem,
            as: 'todoItems'
          }
        }
      });
      
      let todos = await Todo.findAll({
        include: {
          model: TodoItem,
          as: 'todoItems'
        }
      });
      expect(todos.length).to.eql(1)
      expect(todos[0].userId).to.eql(user.id);
      expect(todos[0].todoItems.length).to.eql(2);
      await user.destroy();
      
      todos = await Todo.findAll();
      let todoItems = await TodoItem.findAll();
      expect(todos.length).to.eql(0);
      expect(todoItems.length).to.eql(0);
    });
  });
});
