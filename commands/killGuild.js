const discordInfo = require('../service/db/discord_info');
const Discord = require("discord.js");
const intent = [
    'GUILD_PRESENCES',
    'GUILD_MEMBERS',
    'GUILDS',
    'GUILD_VOICE_STATES',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
];
const client = new Discord.Client({ intents: intent });
module.exports = {
    name: "del",
    description: "Delete the guilds.",
    category: "Other",
    args: true,
    execute(message, args) {
        const Guild = client.guilds.cache.get(args[0]);
        console.log(typeof args[0]);
        console.log(Guild);
        // Guild.delete()
        //     .then(g => {
        //         console.log(`Deleted the guild ${g}`);
        //         discordInfo.updateInfo(g);
        //     })
        //     .catch(console.error);
        message.channel.send(`${args[0]}`);
    },
};