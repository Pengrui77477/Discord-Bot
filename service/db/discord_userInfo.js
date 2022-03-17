const mysql = require('../../config/mysql')

const userInfo = {};

userInfo.setInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "insert into discord_userInfo (user_id,user_name) value (?,?)";
            connection.query(sql, [params.userId,params.userName], function (err, result) {
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
            const sql = "select user_id,user_name from discord_userInfo where user_id=?";
            connection.query(sql, [params], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}
userInfo.updateInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "update discord_userInfo set guild_id=? where user_id=?";
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

module.exports=userInfo;