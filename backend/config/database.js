// backend/config/database.js
const mysql = require('mysql2');

const dbConfig = {
    host: 'localhost',
    user: 'root',          // tente primeiro sem senha
    password: '',          // senha vazia
    database: 'elias_santosdb',
  // ... resto do código
};

// Criar pool de conexões
const pool = mysql.createPool(dbConfig);

// Promisify para usar async/await
const promisePool = pool.promise();

module.exports = promisePool;