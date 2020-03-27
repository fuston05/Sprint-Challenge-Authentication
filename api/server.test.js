const request = require('supertest');
const server = require('./server.js');
const db = require('../database/dbConfig');

describe('server.js', function () {

  describe('the auth-router', function () {

    describe('the auth register endpoint', function () {
      beforeEach(async () => {
        await db('users').truncate();
      });// end truncate db

      it('should return a status 201', function () {
        return request(server)
          .post('/api/auth/register')
          .set('Content-Type', 'application/json')
          .send({ "username": "papa smurf", "password": "password" })
          .expect(201)
      });

      it('should return an object with a message property', function () {
        return request(server)
          .post('/api/auth/register')
          .set('Content-Type', 'application/json')
          .send({ "username": "papa smurf", "password": "password" })
          .then(res => {
            expect(res.body).toHaveProperty('message')
          });
      });
    });//end register endpoint

    describe('the auth logIn endpoint', function () {
      it('should return a status 200', function () {
        return request(server)
          .post('/api/auth/login')
          .set('Content-Type', 'application/json')
          .send({ "username": "papa smurf", "password": "password" })
          .expect(200)
      });

      it('should return an object with a  token property', function () {
        return request(server)
          .post('/api/auth/login')
          .set('Content-Type', 'application/json')
          .send({ "username": "papa smurf", "password": "password" })
          .then(res => {
            expect(res.body).toHaveProperty('token')
          });
      });
    });//end register endpoint

  });//end authRouter

  describe('the jokes-router', function () {
    beforeEach(async () => {
      await db('users').truncate();
    });// end truncate db

    it('should return a status 200', function () {
      //register first
      return request(server)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({ "username": "papa smurf", "password": "password" })
        .then(res => {
          return res
        })
        .then(res => {
          //log in first to get a token
          return request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ "username": "papa smurf", "password": "password" })
            .then(res => {
              return res.body.token;
            })
            .then(token => {
              return request(server)
                .get('/api/jokes')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .expect(200)
            })
        })
    });//status 200

    it('should return an object with a joke property', function () {
      //register first
      return request(server)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({ "username": "papa smurf", "password": "password" })
        .then(res => {
          return res
        })
        .then(res => {
          //log in first to get a token
          return request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ "username": "papa smurf", "password": "password" })
            .then(res => {
              return res.body.token;
            })
            .then(token => {
              return request(server)
                .get('/api/jokes')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .then((res) => {
                  expect(res.body[0]).toHaveProperty('joke')
                })
            })//end token
        })//.then
    });//end it block for joke property

  });//end and jokes-router

})