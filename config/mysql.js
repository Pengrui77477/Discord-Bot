const mysql = require('mysql');
require('dotenv').config()
// const config = {
//     host: 'localhost',
//     user: 'root',
//     password: 'pr774772411',
//     port: '3306',
//     database: 'discord'
// }
const config = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    port: process.env.port,
    database: process.env.database
}
module.exports = mysql.createPool(config);