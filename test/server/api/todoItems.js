const server = require('../../../app');
let admin, token;

describe('server/controllers/todoItems', () => {
  afterEach((done) => {
    dbCleaner().then(done());
  });

  describe('As Admin', () => {
    beforeEach(async() => {
      admin = await factories.create('admin');
      token = await loginUser(server, admin);
    });

    describe('Create TodoItem', () => {
      it('should create a TodoItem', async() => {
        const todo = await factories.create('todo', { userId: admin.id });
        const todoItemParams = {
          content: 'A new TodoItem'
        }
        const res = await chai
                            .request(server)
                            .post(`/api/todos/${todo.id}/items`)
                            .set('Authorization', token)
                            .send(todoItemParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('content');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
        expect(res.body.content).to.eql('A new TodoItem');
        expect(res.body.todoId).to.eql(todo.id);
      });
  
      it('should fail when Todo not found', async() => {
        const todoItemParams = {
          content: 'A new TodoItem'
        }
        const res = await chai
                            .request(server)
                            .post('/api/todos/123321/items')
                            .set('Authorization', token)
                            .send(todoItemParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.eql('Todo Not Found');
      });
  
      it('should validate content length', async() => {
        const todo = await factories.create('todo', { userId: admin.id });
        const todoItemParams = {
          content: ''
        }
        const res = await chai
                            .request(server)
                            .post(`/api/todos/${todo.id}/items`)
                            .set('Authorization', token)
                            .send(todoItemParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message)
          .to
          .eql('Validation error: Content should be between 1 and 255 characters');
      });
    });
  
    describe('Update TodoItem', () => {
      it('should update a Todo', async() => {
        const todoItemParams = {
          content: 'Updated TodoItem',
          complete: true
        }
        const todo = await factories.create('todo', { userId: admin.id });
        const todoItem = await factories.create('todoItem', { todoId: todo.id });
        const res = await chai
                            .request(server)
                            .put(`/api/todos/${todo.id}/items/${todoItem.id}`)
                            .set('Authorization', token)
                            .send(todoItemParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('content');
        expect(res.body).to.have.property('complete');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
        expect(res.body.content).to.eql('Updated TodoItem');
        expect(res.body.complete).to.eql(true);
      });
  
      it('should fail when TodoItem not found', async() => {
        const todoItemParams = {
          content: 'Updated TodoItem'
        }
        const res = await chai
                            .request(server)
                            .put('/api/todos/123321/items/123456')
                            .set('Authorization', token)
                            .send(todoItemParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.eql('TodoItem Not Found');
      });
    });
  
    describe('Delete TodoItem', () => {
      it('should delete a TodoItem', async() => {
        const todo = await factories.create('todo', { userId: admin.id });
        const todoItem = await factories.create('todoItem', { todoId: todo.id });
        const res = await chai
                            .request(server)
                            .delete(`/api/todos/${todo.id}/items/${todoItem.id}`)
                            .set('Authorization', token)
                            .then((res) => { return res });
        expect(res.status).to.eql(204);
        expect(res.body).to.be.an('object');
      });
    });
  });

  describe('As User', () => {
    beforeEach(async() => {
      user = await factories.create('user');
      token = await loginUser(server, user);
    });

    describe('Create TodoItem', () => {
      it('should create a TodoItem', async() => {
        const todo = await factories.create('todo', { userId: user.id });
        const todoItemParams = {
          content: 'A new TodoItem'
        }
        const res = await chai
                            .request(server)
                            .post(`/api/todos/${todo.id}/items`)
                            .set('Authorization', token)
                            .send(todoItemParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('content');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
        expect(res.body.content).to.eql('A new TodoItem');
        expect(res.body.todoId).to.eql(todo.id);
      });

      it('should not be able to create a TodoItem if unauthorized', async() => {
        const todo = await factories.create('todo', { userId: user.id });
        const todoItemParams = {
          title: 'My Todo Item'
        }
        const res = await chai
                            .request(server)
                            .post(`/api/todos/${todo.id}/items`)
                            .set('Authorization', 'dummyToken')
                            .send(todoItemParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(401);
      });

      it('should not be able to create a TodoItem if Todo belongs to another user', async() => {
        const user2 = await factories.create('user');
        const todo = await factories.create('todo', { userId: user2.id });
        const todoItemParams = {
          title: 'My Todo Item'
        }
        const res = await chai
                            .request(server)
                            .post(`/api/todos/${todo.id}/items`)
                            .set('Authorization', token)
                            .send(todoItemParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(403);
        expect(res.body.message).to.eql('Cannot execute "update" on "Todo"');
      });
    });

    describe('Update TodoItem', () => {
      it('should not be able to update a TodoItem if Todo belongs to another user', async() => {
        const user2 = await factories.create('user');
        const todo = await factories.create('todo', { userId: user2.id });
        const todoItem = await factories.create('todoItem', { todoId: todo.id });
        const todoItemParams = {
          title: 'My Todo Item'
        }
        const res = await chai
                            .request(server)
                            .put(`/api/todos/${todo.id}/items/${todoItem.id}`)
                            .set('Authorization', token)
                            .send(todoItemParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(403);
        expect(res.body.message).to.eql('Cannot execute "update" on "TodoItem"');
      });
    });

    describe('Delete TodoItem', () => {
      it('should not be able to delete a TodoItem if Todo belongs to another user', async() => {
        const user2 = await factories.create('user');
        const todo = await factories.create('todo', { userId: user2.id });
        const todoItem = await factories.create('todoItem', { todoId: todo.id });
        const res = await chai
                            .request(server)
                            .delete(`/api/todos/${todo.id}/items/${todoItem.id}`)
                            .set('Authorization', token)
                            .then((res) => { return res });
        expect(res.status).to.eql(403);
        expect(res.body.message).to.eql('Cannot execute "delete" on "TodoItem"');
      });
    });
  });
});
