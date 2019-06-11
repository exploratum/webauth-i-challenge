const db = require('./dbConfig');

function add(user) {
    return db('users').insert(user);
}

function findByUsername(username) {
    return db('users').where('username', username).first();
}

function findAll() {
    return db('users');
}

function findById(id) {
    return db('users').where('id', id)
}

module.exports = {
    add,
    findByUsername,
    findAll,
    findById
}


