const server = require('../../../app');

describe('Todos', () => {
  afterEach((done) => {
    dbCleaner().then(done());
  });

  describe('Fetch Todos', () => {
    it('it should GET all the Todos with Todo Items', async() => {
      const todo = await factories.create('todo').then(async(todo) => { 
        todo.todoItems = await factories
                                 .createMany('todoItem', 2, { todoId: todo.id })
                                 .then(todoItems => { return todoItems });
        return todo; 
      });
      const res = await chai.request(server).get('/api/todos');
      expect(res.status).to.eql(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.eql(1);
      expect(res.body[0].title).to.eql(todo.title);
      expect(res.body[0].todoItems.length).to.eql(2);
      expect(res.body[0].todoItems.map(item => item.content).sort())
        .to
        .eql(todo.todoItems.map(item => item.content).sort());
    });

    it('it should return an empty array when there are no Todos', async() => {
      const res = await chai.request(server).get('/api/todos');
      expect(res.status).to.eql(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.eql([]);
    });
  });

  describe('Fetch Todo by id', () => {
    it('it should GET a Todo with Todo Items', async() => {
      const todo = await factories.create('todo').then(async(todo) => { 
        todo.todoItems = await factories
                                 .createMany('todoItem', 2, { todoId: todo.id })
                                 .then(todoItems => { return todoItems });
        return todo; 
      });
      const res = await chai.request(server).get(`/api/todos/${todo.id}`);
      expect(res.status).to.eql(200);
      expect(res.body).to.be.an('object');
      expect(res.body.title).to.eql(todo.title);
      expect(res.body.todoItems.length).to.eql(2);
      expect(res.body.todoItems.map(item => item.content).sort())
        .to
        .eql(todo.todoItems.map(item => item.content).sort());
    });

    it('it should return an error message when Todo not found', async() => {
      const res = await chai.request(server).get('/api/todos/dummyId');
      expect(res.status).to.eql(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.eql('invalid input syntax for integer: "dummyId"');
    });
  });

  describe('Create Todo', () => {
    it('it should create a Todo', async() => {
      const todoParams = {
        title: 'My Todo'
      }
      const res = await chai
                          .request(server)
                          .post('/api/todos')
                          .send(todoParams)
                          .then((res) => { return res });
      expect(res.status).to.eql(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('title');
      expect(res.body).to.have.property('createdAt');
      expect(res.body).to.have.property('updatedAt');
      expect(res.body.title).to.eql('My Todo');
    });

    it('it should validate Todo title presence', async() => {
      const todoParams = {
        title: null
      }
      const res = await chai
                          .request(server)
                          .post('/api/todos')
                          .send(todoParams)
                          .then((res) => { return res });
      expect(res.status).to.eql(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
    });

    it('it should validate Todo title length', async() => {
      const todoParams = {
        title: ""
      }
      const res = await chai
                          .request(server)
                          .post('/api/todos')
                          .send(todoParams)
                          .then((res) => { return res });
      expect(res.status).to.eql(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message)
        .to
        .eql('Validation error: Title should be between 1 and 255 characters');
    });
  });
});
