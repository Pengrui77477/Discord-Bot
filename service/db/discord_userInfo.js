const mysql = require('../../config/mysql')

const userInfo = {};

userInfo.setInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "insert into discord_userinfo (user_id,guild_id) value (?,?)";
            connection.query(sql, [params.user.id, params.guild.id], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}
userInfo.getInfo=function(params){
    return new Promise(function(resolve,reject){
        mysql.getConnection(function(err,connection){
            const sql="select (user_id,guild_id) from discord_userinfo where user_id=?";
            connection.query(sql, [params.user.id], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}
userInfo.delInfo=function(params){
    return new Promise(function(resolve,reject){
        mysql.getConnection(function(err,connection){
            const sql="delete from discord_userinfo where user_id=? and guild_id=?";
            connection.query(sql,[params.user.id,params.guild.id],function(err,result){
                if(err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}

module.exports=userInfo;