const mysql = require('../../config/mysql')

const discordInfo = {};

discordInfo.setInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "insert into discord_info (user_id,guild_id,nft_owner,nft_follower) value (?,?,?,?)";
            connection.query(sql, [params.userId, params.guildId, params.nftOwner, params.nftFollower], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}

discordInfo.getguildId = function (userId) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "SELECT guild_id,nft_owner,nft_follower from discord_info where user_id=?";
            connection.query(sql, userId, function (err, result) {
                if (err) reject(err);
                resolve(result.length === 0 ? null : result[0]);
            });
            connection.release();
        })
    })
}

discordInfo.updateInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = 'UPDATE discord_info SET nft_owner=?,nft_follower = ? WHERE user_id = ? and guild_id =?';
            connection.query(sql, [params.nftOwner, params.nftFollower, params.userId, params.guildId], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        });
    })
}

discordInfo.getInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "SELECT nft_owner,nft_follower from discord_info where user_id=? and guild_id=?";
            connection.query(sql, [params.userId,params.guildId], function (err, result) {
                if (err) reject(err);
                resolve(result.length === 0 ? null : result[0]);
            });
            connection.release();
        })
    })
}

module.exports = discordInfo;