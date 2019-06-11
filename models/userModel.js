const db = require('./dbConfig');

function add(user) {
    return db('users').insert(user);
}

function findByUsername(username) {
    return db('users').where({username}).first();
}

function find() {
    return db('users');
}

module.exports = {
    add,
    findByUsername,
    find
}


