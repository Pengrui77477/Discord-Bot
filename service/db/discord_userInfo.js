const mysql = require('../../config/mysql')

const userInfo = {};

userInfo.setInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "insert into discord_user_info (user_id,user_name,guild_id) value (?,?,?)";
            connection.query(sql, [params.userId, params.userName, params.guildId], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}
userInfo.getInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "select user_id,user_name from discord_user_info where user_id=? and guild_id=?";
            connection.query(sql, [params.userId, params.userId], function (err, result) {
                if (err) reject(err);
                resolve(result.length === 0 ? null : result[0]);
            });
            connection.release();
        })
    })
}
userInfo.updateInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "update discord_user_info set guild_id=? where user_id=?";
            connection.query(sql, [params], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}
// userInfo.getInfo=function(params){
//     return new Promise(function(resolve,reject){
//         mysql.getConnection(function(err,connection){
//             const sql="select (user_id,guild_id) from discord_userinfo where user_id=?";
//             connection.query(sql, [params.user.id], function (err, result) {
//                 if (err) reject(err);
//                 resolve(result);
//             });
//             connection.release();
//         })
//     })
// }
// userInfo.delInfo=function(params){
//     return new Promise(function(resolve,reject){
//         mysql.getConnection(function(err,connection){
//             const sql="delete from discord_userinfo where user_id=? and guild_id=?";
//             connection.query(sql,[params.user.id,params.guild.id],function(err,result){
//                 if(err) reject(err);
//                 resolve(result);
//             });
//             connection.release();
//         })
//     })
// }

module.exports = userInfo;