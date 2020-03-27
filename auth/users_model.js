const db = require('../database/dbConfig');

module.exports = {
  add,
  findBy,
}

function add(newUser) {
  return db('users').insert(newUser);
}//end add

function findBy(filter) {
  return db('users').where(filter);
}//end find