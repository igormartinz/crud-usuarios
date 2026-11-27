const {Pool} = require('pg');

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: 'usuario',
    password: 'senha',
    database: 'nome_banco'
});

module.exports = pool;