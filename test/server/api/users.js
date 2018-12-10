const server = require('../../../app');
let admin, user, disabledUser, token;

describe('server/controllers/users', () => {
  afterEach((done) => {
    dbCleaner().then(done());
  });

  describe('As Admin', () => {
    beforeEach(async() => {
      admin = await factories.create('admin');
      token = await loginUser(server, admin);
    });

    describe('Fetch Users', () => {
      it('should GET all the Users', async() => {
        const user1 = await factories.create('admin');
        const user2 = await factories.create('user');
        const res = await chai.request(server)
                              .get('/api/users')
                              .set('Authorization', token);
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.eql(3);
        expect(res.body[0].email).to.eql(admin.email);
        expect(res.body[1].email).to.eql(user1.email);
        expect(res.body[2].email).to.eql(user2.email);
      });
    });

    describe('Fetch User by ID', () => {
      it('should GET an User', async() => {
        const user1 = await factories.create('user');
        const res = await chai.request(server)
                              .get(`/api/users/${user1.id}`)
                              .set('Authorization', token);
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.eql(user1.email);
        expect(res.body.firstName).to.eql(user1.firstName);
        expect(res.body.lastName).to.eql(user1.lastName);
        expect(res.body.role).to.eql(user1.role);
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
      });
    });

    describe('Fetch Profile', () => {
      it('should GET current User\'s profile', async() => {
        const res = await chai.request(server)
                              .get('/api/profile')
                              .set('Authorization', token);
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.eql(admin.email);
        expect(res.body.firstName).to.eql(admin.firstName);
        expect(res.body.lastName).to.eql(admin.lastName);
        expect(res.body.role).to.eql(admin.role);
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
      });
    });

    describe('Create User', () => {
      it('should create an User', async() => {
        const userParams = {
          email: 'test@test.com',
          firstName: 'John',
          lastName:'Doe',
          password: 'password',
          role: 'user'
        };
        const res = await chai
                            .request(server)
                            .post('/api/users')
                            .set('Authorization', token)
                            .send(userParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(201);
        expect(res.body).to.be.an('object');
        expect(res.body.firstName).to.eql('John');
        expect(res.body.lastName).to.eql('Doe');
        expect(res.body.email).to.eql('test@test.com');
        expect(res.body.role).to.eql('user');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
      });
    });

    describe('Update User', () => {
      it('should update an User', async() => {
        const user1 = await factories.create('user');
        const userParams = {
          email: 'another@test.com',
          firstName: 'First1',
          lastName:'Last1',
          password: 'password1',
          role: 'admin'
        };
        const res = await chai
                            .request(server)
                            .put(`/api/users/${user1.id}`)
                            .set('Authorization', token)
                            .send(userParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.firstName).to.eql('First1');
        expect(res.body.lastName).to.eql('Last1');
        expect(res.body.email).to.eql('another@test.com');
        expect(res.body.role).to.eql('admin');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
      });
    });

    describe('Delete User', () => {
      it('should delete an User', async() => {
        const user1 = await factories.create('user');
        const res = await chai
                            .request(server)
                            .delete(`/api/users/${user1.id}`)
                            .set('Authorization', token)
                            .then((res) => { return res });
        expect(res.status).to.eql(204);
      });
    });
  });

  describe('As User', () => {
    beforeEach(async() => {
      user = await factories.create('user');
      token = await loginUser(server, user);
    });

    describe('Fetch Users', () => {
      it('should GET only own User info', async() => {
        await factories.createMany('admin', 5);
        const res = await chai.request(server)
                              .get('/api/users')
                              .set('Authorization', token);
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.eql(1);
        expect(res.body[0].email).to.eql(user.email);
      });
    });

    describe('Fetch User by ID', () => {
      it('should GET only own User info', async() => {
        const res = await chai.request(server)
                              .get(`/api/users/${user.id}`)
                              .set('Authorization', token);
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.eql(user.email);
        expect(res.body.firstName).to.eql(user.firstName);
        expect(res.body.lastName).to.eql(user.lastName);
        expect(res.body.role).to.eql(user.role);
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
      });

      it('should not be able to get other User\'s info', async() => {
        const user1 = await factories.create('user');
        const res = await chai.request(server)
                              .get(`/api/users/${user1.id}`)
                              .set('Authorization', token);
        expect(res.status).to.eql(403);
        expect(res.body.message).to.eql('Cannot execute "read" on "User"');
      });
    });

    describe('Fetch Profile', () => {
      it('should GET current User\'s profile', async() => {
        const res = await chai.request(server)
                              .get('/api/profile')
                              .set('Authorization', token);
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.eql(user.email);
        expect(res.body.firstName).to.eql(user.firstName);
        expect(res.body.lastName).to.eql(user.lastName);
        expect(res.body.role).to.eql(user.role);
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
      });
    });

    describe('Create User', () => {
      it('should should not be able to create an User', async() => {
        const userParams = {
          email: 'another@test.com',
          firstName: 'First1',
          lastName:'Last1',
          password: 'password1'
        };
        const res = await chai
                            .request(server)
                            .post('/api/users')
                            .set('Authorization', token)
                            .send(userParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(403);
        expect(res.body.message).to.eql('Cannot execute "create" on "User"');
      });
    });

    describe('Update User', () => {
      it('should update only own User\'s profile', async() => {
        const userParams = {
          email: 'another@test.com',
          firstName: 'First1',
          lastName:'Last1',
          password: 'password1'
        };
        const res = await chai
                            .request(server)
                            .put(`/api/users/${user.id}`)
                            .set('Authorization', token)
                            .send(userParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.firstName).to.eql('First1');
        expect(res.body.lastName).to.eql('Last1');
        expect(res.body.email).to.eql('another@test.com');
        expect(res.body.role).to.eql('user');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
      });

      it('should not be able to update own role', async() => {
        const userParams = {
          role: 'admin'
        };
        const res = await chai
                            .request(server)
                            .put(`/api/users/${user.id}`)
                            .set('Authorization', token)
                            .send(userParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(403);
        expect(res.body.message).to.eql('Cannot execute "update" on "User"');
      });

      it('should not be able to update other User\'s profile', async() => {
        const user1 = await factories.create('user');
        const userParams = {
          role: 'admin'
        };
        const res = await chai
                            .request(server)
                            .put(`/api/users/${user1.id}`)
                            .set('Authorization', token)
                            .send(userParams)
                            .then((res) => { return res });
        expect(res.status).to.eql(403);
        expect(res.body.message).to.eql('Cannot execute "update" on "User"');
      });
    });

    describe('Delete User', () => {
      it('should should not be able to delete an User', async() => {
        const res = await chai
                            .request(server)
                            .delete(`/api/users/${user.id}`)
                            .set('Authorization', token)
                            .then((res) => { return res });
        expect(res.status).to.eql(403);
        expect(res.body.message).to.eql('Cannot execute "delete" on "User"');
      });
    });
  });

  describe('As Disabled User', () => {
    beforeEach(async() => {
      disabledUser = await factories.create('disabledUser');
      token = await loginUser(server, disabledUser);
    });

    describe('Fetch Profile', () => {
      it('should should not be able to feth profile info', async() => {
        const res = await chai.request(server)
                              .get('/api/profile')
                              .set('Authorization', token);
        expect(res.status).to.eql(403);
        expect(res.body.message).to.eql('Cannot execute "read" on "User"');
      });
    });
  });
});
