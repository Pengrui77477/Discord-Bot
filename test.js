const express = require("express");
const discordInfo = require('./db/discord_info');
const fs = require("fs");
const Discord = require("discord.js");
const { MessageEmbed, Permissions } = require('discord.js');
const intent = [
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS',
];
const client = new Discord.Client({ intents: intent });



const app = express();
app.use(express.json());
const port = 3002;

// let userMap = new Map();

app.get("/", (req, res) => res.send("hello world"));
// 接收创建服务器的请求
app.post("/discord/createChannel", (req, res) => {
  res.send("createChannel");
});

// 接收验证结果
app.post("/discord/discordAuth", async (req, res) => {
  res.send("createChannel");
  console.log(req.body)
  const judge = await discordInfo.getInfo(req.body);
  if (judge) {
    await discordInfo.updateInfo(req.body);
    return null;
  }
  await discordInfo.setInfo(req.body);
});
app.listen(port, () =>
  console.log(`Rob listening at http://localhost:${port}`)
);

client.on('guildMemberAdd', async member => {
  if (member.user.bot) return;
  //机器人发送私信
  try {
    // const row = new Discord.MessageActionRow()
    //   .addComponents(
    //     new Discord.MessageButton()
    //       .setCustomId(`deletable`)
    //       .setLabel('Verification completed')
    //       .setStyle('PRIMARY')
    //   );
    const sendUrl = `https://test.planft.com/`;
    const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
    const statement = 'After verification, please click the button below';
    const Embed = new MessageEmbed()
      .setColor('#f542d4')
      .setTitle(`Welcome to the plaNFT ${member.user.tag} 👋`)
      .setDescription(`❗Before you start chatting, you only need to do two things: \n • First click the link to verify
                      • Second, go to the server's verification channel and click the verification button`)
      .addFields(
        { name: ' 👇 Please click the link below to verify', value: `${verifyUrl}` },
        { name: 'Then click the button to obtain the guild permission', value: `${statement}`, },
      )
      .setTimestamp()
      .setFooter({ text: 'PlaNFT' });
    // const sendChannel=member.guild.channels.cache.get("935723971310133268");
    // sendChannel.send({ ephemeral: true, embeds: [Embed], components: [row] });
    member.user.send({ ephemeral: true, embeds: [Embed] });
  } catch (err) {
    console.log(err)
  }
});

client.on('interactionCreate', async (interaction) => {
  console.log(interaction);
  const data = {
    userId: interaction.user.id,
    guildId: interaction.guild.id
  }
  const info = await discordInfo.getInfo(data);
  console.log(info)
  const bool = info.nft_owner;

  const Guild = client.guilds.cache.get(data.guildId);
  // const sendChannel=interaction.guild.channels.cache.get("935723971310133268");

  if (bool == 1) {
    let role = Guild.roles.cache.find(role => role.name === "Owner");
    let member = await Guild.members.fetch(`${interaction.user.id}`);
    if (!role) {
      Guild.roles.create({
        // name: 'founder',
        // color: '#ff4000',
        // hoist: true,
        // permissions: [Permissions.FLAGS.ADMINISTRATOR]
        name: 'Owner',
        color: '#00ffff',
        hoist: true,
        permissions: [Permissions.FLAGS.VIEW_CHANNEL]
      }).then(role => {
        member.roles.add(role);
      })
    } else {
      member.roles.add(role);
    }

    embed = new MessageEmbed()
      .setColor('#f542d4')
      .setTitle('✅  Verification successful! Now you can chat freely in your guild!')
      .setTimestamp()
      .setFooter({ text: 'PlaNFT' });
    interaction.user.send({ embeds: [embed] });
    // sendChannel.send({ embeds: [embed] });
  } else {

    const embed = new MessageEmbed()
      .setColor('#f542d4')
      .setTitle(`❌  Sorry ${interaction.user.username} , you're not a follower of the NFT`)
      .setTimestamp()
      .setFooter({ text: 'PlaNFT' });
    interaction.user.send({ embeds: [embed] })
    // sendChannel.send({ embeds: [embed] });

  }
  await interaction.deferUpdate();
})

client.once("ready", () => {
  console.log(`Rob is ready!`);

});
let prefix = ".";
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  if (message.content == "group") {
    const Guild = await client.guilds.create("Test-PlaNFT-Guild", {
      channels: [
        { "name": "channel-1" },
      ]
    });
    // console.log(Guild);
    const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
    const channelId = GuildChannel.id;
    db.set("channelId", channelId).then(() => {
      console.log("success");
    })
    const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
    // console.log(Invite);
    message.channel.send(`邀请您进群: ${Invite.url}`);
  };
})
client.on("messageCreate", async (message) => {
  if (
    message.content == `<@${client.user.id}>` ||
    message.content == `<@!${client.user.id}>`
  )
    return message.channel.send(`The prefix is \`${prefix}\`.`);

  if (message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);

  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;
  if (command.guildOnly && message.channel.type !== "GUILD_TEXT") {
    return message.reply("I can't execute that command inside DMs!");
  }
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments! \n`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.reply(reply);
  }
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(`执行时发生错误: \n ${error}`);
  }
});

client.login(process.env.token);
