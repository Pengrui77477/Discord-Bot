const express = require("express");

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
const fs = require("fs");
const client = new Discord.Client({ intents: intent });
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const app = express();
app.use(express.json());
const port = 3002;

let userMap = new Map();

app.get("/", (req, res) => res.send(`hello world`));
const Database = require("@replit/database");
const db = new Database();
const port = 3001
app.get("/", (req, res) => res.send("Rob listening at http://localhost:8080"));
// 接收创建服务器的请求
app.post("/discord/createChannel", (req, res) => {
  res.send("createChannel");
});

// 接收验证结果
app.post("/discord/discordAuth", (req, res) => {
  res.send("createChannel");
  console.log(req.body)
  const userId = req.body.userId
  const nftFollower = req.body.nftFollower
  userMap.set(userId, nftFollower)
});
app.listen(port, () =>
  console.log(`Rob listening at http://localhost:${port}`)
);

client.on('guildMemberAdd', async member => {
  if (member.user.bot) return;
  //机器人发送私信
  try {
    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId(`deletable`)
          .setLabel('Verification completed')
          .setStyle('PRIMARY')
      );
    const sendUrl = `https://test.planft.com/`;
    const verifyUrl = `http://192.168.50.54:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
    const statement = 'After verification, please click the button below';
    const Embed = new MessageEmbed()
      .setColor('#f542d4')
      .setTitle('Welcome to the plaNFT 👋')
      .setDescription(`❗Before you start chatting, you only need to do two things: \n • First click the link to verify
                      • Second, click the button to obtain permission`)
      .addFields(
        { name: ' 👇 Please click the link below to verify', value: `${verifyUrl}` },
        { name: 'Then click the button to obtain the guild permission', value: `${statement}`, },
      )
      .setTimestamp()
      .setFooter({ text: 'PlaNFT' });
    member.user.send({ ephemeral: true, embeds: [Embed], components: [row] });
  } catch (err) {
    console.log(err)
  }
});

client.on('interactionCreate', async (interaction) => {
  const userId = interaction.user.id
  const bool = userMap.get(userId);
  console.log(bool);

  const guildId = '930041271748284446';
  const Guild = await client.guilds.cache.get(guildId);

  if (bool == 1) {
    let role = await Guild.roles.cache.find(role => role.name === "founder");
    let member = await Guild.members.fetch(`${interaction.user.id}`);
    if (!role) {
      Guild.roles.create({
        name: 'founder',
        color: '#ff4000',
        hoist: true,
        permissions: [Permissions.FLAGS.ADMINISTRATOR]
      }).then(role => {
        member.roles.add(role);
      })
    } else {
      member.roles.add(role);
      // console.log(member)
    }

    embed = new MessageEmbed()
      .setColor('#f542d4')
      .setTitle('✅  Verification successful! Now you can chat freely in your guild!')
      .setTimestamp()
      .setFooter({ text: 'PlaNFT' });
    interaction.user.send({ embeds: [embed] });

  } else {

    const embed = new MessageEmbed()
      .setColor('#f542d4')
      .setTitle(`❌  Sorry, you're not a follower of the NFT`)
      .setTimestamp()
      .setFooter({ text: 'PlaNFT' });
    interaction.user.send({ embeds: [embed] })

  }
  await interaction.deferUpdate();
})

client.once("ready", () => {
  console.log(`Rob listening at http://localhost:${port}`);
});
let prefix = ".";

client.on("messageCreate", async (message) => {
  if (
    message.content == `<@${client.user.id}>` ||
    message.content == `<@!${client.user.id}>`
  )
    return message.channel.send(`The prefix is \`${prefix}\`.`);

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

client.login('OTMzMjU2MDcxNTU0OTQwOTc5.Yee4cg.kVIS1RsgTHfJOSbARFQN_2yLQFU');
