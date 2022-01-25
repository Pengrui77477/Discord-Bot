const mysql = require('../config/mysql')

const discordInfo={};

discordInfo.setInfo=function(params){
    return new Promise(function (resolve,reject){
        mysql.getConnection(function (err,connection){
            const sql="insert into discord_info (user_id,guild_id,nft_owner,nft_follower) value (?,?,?,?)";
            connection.query(sql, [params.userId, params.guildId, params.nftOwner,params.nftFollower], function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
            connection.release();
        })
    })
}

discordInfo.getInfo=function(params){
    return new Promise(function (resolve,reject){
        mysql.getConnection(function (err,connection){
            const sql="SELECT guild_id,nft_owner,nft_follower from discord_info where user_id=?";
            connection.query(sql, params, function (err, result) {
                if (err) reject(err);
                resolve(result.length === 0 ? null : result[0]);
            });
            connection.release();
        })
    })
}

module.exports=discordInfo;