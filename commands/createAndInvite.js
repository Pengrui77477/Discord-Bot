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
  name: "invite",
  description: "Create guild.",
  category: "Fun",
  guildOnly: true,
  execute(message, args) {
    const Guild = await client.guilds.create("test-PlaNFT-Guild", {
      channels: [
        { "name": "channel-1" },
      ]
    });
    const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
    const channelId = GuildChannel.id;
    db.set("channelId", channelId).then(() => {
      console.log("success");
    })
    const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
    message.channel.send(`邀请您进群: ${Invite.url}`);
  },
};



