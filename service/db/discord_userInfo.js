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

module.exports=userInfo;