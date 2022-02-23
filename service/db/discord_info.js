const mysql = require('../../config/mysql')

const discordInfo = {};

discordInfo.setInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "insert into discord_guild (guild_id,guild_name,invite_link,chain_symbol,contract_address,mint_name,status,client_id,client_secret,client_redirect_url) value (?,?,?,?,?,?,?,?,?,?)";
            connection.query(sql, [params.guild_id, params.guild_name, params.invite_link, params.chain_symbol, params.contract_address, params.mint_name, 'available', params.client_id, params.client_secret, params.client_redirect_url], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}

discordInfo.updateStatus = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = 'UPDATE discord_guild SET status=? where guild_id=?';
            connection.query(sql, ["block up", params.id], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        });
    })
}

discordInfo.updateInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = 'UPDATE discord_guild SET user_id=?,mint_name=?,access_token=? where guild_id=?';
            connection.query(sql, [params.user_id, params.mint_name, params.access_token, params.guild_id], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}

discordInfo.getInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "SELECT user_id,guild_id from discord_guild where guild_id=?";
            connection.query(sql, [params], function (err, result) {
                if (err) reject(err);
                resolve(result.length === 0 ? null : result[0]);
            });
            connection.release();
        })
    })
}

// discordInfo.getguildId = function (userId) {
//     return new Promise(function (resolve, reject) {
//         mysql.getConnection(function (err, connection) {
//             const sql = "SELECT guild_id,nft_owner,nft_follower from discord_info where user_id=?";
//             connection.query(sql, userId, function (err, result) {
//                 if (err) reject(err);
//                 resolve(result.length === 0 ? null : result[0]);
//             });
//             connection.release();
//         })
//     })
// }





module.exports = discordInfo;