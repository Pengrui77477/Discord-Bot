const express = require("express");
// const discordInfo = require('./service/db/discord_info');
const userInfo = require('./service/db/discord_userInfo');
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
app.get("/", (req, res) => res.send("hello world"));
app.listen(port, () =>
  console.log(`Rob listening at http://localhost:${port}`)
);

// 接收创建服务器的请求
app.post("/discord/createChannel", (req, res) => {
  res.send("createChannel");
});

// 接收验证结果
app.post("/discord/discordAuth", async (req, res) => {
  res.send("createChannel");
  console.log(req.body)

  const Guild =client.guilds.cache.get(req.body.guildId);
  // const member = await Guild.members.fetch(req.body.userId);
  const member =Guild.members.cache.get(req.body.userId);

  //如果用户存在当前服务器
  if (member) {
    if (req.body.nftOwner) {
      let role = Guild.roles.cache.find(role => role.name === "[Verified]");
      if (!role) {
        Guild.roles.create({
          name: '[Verified]',
          color: '#4fc974',
          hoist: true,
          permissions: [Permissions.FLAGS.VIEW_CHANNEL]
        }).then(role => {
          member.roles.add(role);
        });
      } else {
        member.roles.add(role);
      }
      //判断用户是否已经拥有角色，避免点击重复发送信息
      const isRole = member.roles.cache.find(role => role.name === "[Verified]");
      if (!isRole) {
        embed = new MessageEmbed()
          .setColor('#f542d4')
          .setTitle('✅  Verification successful! Now you can chat freely in your guild!')
          .setTimestamp()
          .setFooter({ text: 'PlaNFT' });
        member.send({ embeds: [embed] });
        //将该用户信息插入数据库
        userInfo.setInfo(member);
      }
    } else {
      //判断用户是否已经拥有角色，避免点击重复发送信息
      const isRole = member.roles.cache.find(role => role.name === "[Verified]");
      if (isRole) return;

      const embed = new MessageEmbed()
        .setColor('#f542d4')
        .setTitle(`❌  Sorry ${member.user.username} , you're not a follower of the NFT`)
        .setTimestamp()
        .setFooter({ text: 'PlaNFT' });
      member.send({ embeds: [embed] })
    }
  }
});


client.on('guildMemberAdd', async member => {
  if (member.user.bot) return;
  //机器人发送私信
  try {
    const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
    const Embed = new MessageEmbed()
      .setColor('#f542d4')
      .setTitle(`Welcome to the plaNFT 👋`)
      // .setDescription(`❗Before you start chatting, you only need to do two things: \n • First click the link to verify
      //               • Second, go to the server's verification channel and click the verification button`)
      .addFields(
        { name: ' 👇 Please click the link below to verify', value: `${verifyUrl}` },
      )
      .setTimestamp()
      .setFooter({ text: 'PlaNFT' });
    member.user.send({ ephemeral: true, embeds: [Embed] });
    
    //超过2分钟未验证成功，踢出
    // setTimeout(() => {
    //   const role = member.roles.cache.find(role => role.name === "[Verified]");
    //   if (!role) {
    //     member.kick()
    //       .then(m => { console.log(`kicked the member: ${m}`) });
    //   }
    // }, 200000);
  } catch (err) {
    console.log(err)
  }
});

client.on('guildMemberRemove', async member =>{
  userInfo.delInfo(member);

})

//定时操作，避免过久未响应宕机
setInterval(()=>{
  console.log('refresh...')
},30000);

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

  if (message.content == ".createguild") {
    const Guild = await client.guilds.create("Test-PlaNFT-Guild", {
      channels: [
        { "name": "channel-1" },
      ]
    });
    const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
    const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
    message.channel.send(`邀请您进群: ${Invite.url}`);
  };
  if (message.content === ".transfer") {
    message.channel.send(`Now I will to transfer the guild to \`@${message.author.username}\``);
    setTimeout(async () => {
      await message.guild.setOwner(message.author)
        .then(guild => guild.fetchOwner())
        .then(owner => console.log(`Update the owner :${owner}`));
    }, 2000);
  }
  if (message.content === ".showtable") {
    console.log(client.guilds.cache);
  }
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
