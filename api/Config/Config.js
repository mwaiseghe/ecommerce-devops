const mssql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: 'localhost',
    database: process.env.DB_NAME,
    pool : {
        max : 10,
        min : 0,
        idleTimeoutMillis : 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: false
    }
};

module.exports = {
    mssql,
    sqlConfig
}