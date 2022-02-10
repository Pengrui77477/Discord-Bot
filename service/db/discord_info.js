const mysql = require('../../config/mysql')

const discordInfo = {};

discordInfo.setInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = "insert into test_discord_guild (guild_id,guild_name,invite_link,chain_symbol,contract_address,mint_name,status,user_id,access_token) value (?,?,?,?,?,?,?,?,?)";
            connection.query(sql, [params.guild_id, params.guild_name, params.invite_link,params.chain_symbol,params.contract_address,params.mint_name,'available',params.user_id,params.access_token], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}

discordInfo.updateInfo = function (params) {
    return new Promise(function (resolve, reject) {
        mysql.getConnection(function (err, connection) {
            const sql = 'UPDATE test_discord_guild SET status=? where guild_id=?';
            connection.query(sql, ["block up",params.id], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        });
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



// discordInfo.getInfo = function (params) {
//     return new Promise(function (resolve, reject) {
//         mysql.getConnection(function (err, connection) {
//             const sql = "SELECT nft_owner,nft_follower from discord_info where user_id=? and guild_id=?";
//             connection.query(sql, [params.userId,params.guildId], function (err, result) {
//                 if (err) reject(err);
//                 resolve(result.length === 0 ? null : result[0]);
//             });
//             connection.release();
//         })
//     })
// }

module.exports = discordInfo;