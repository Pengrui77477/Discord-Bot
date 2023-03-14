const mysql = require('mysql');
require('dotenv').config()
const config = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    port: process.env.port,
    database: process.env.database
}
module.exports = mysql.createPool(config);
