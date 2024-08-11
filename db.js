const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql:///biztime_test";
} else {
    DB_URI = "postgresql:///biztime";
}

let db = new Client({
    connectionString: DB_URI
});

db.connect();

// import pg from 'pg'
// const { Client } = pg

// const client = new Client({
//     user: 'database-user',
//     password: 'secretpassword!!',
//     host: 'my.database-server.com',
//     port: 3000,
//     database: 'database-name',

// })module.exports = db;