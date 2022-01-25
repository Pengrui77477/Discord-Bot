const express = require("express");

// const fs = require("fs");
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
// client.commands = new Discord.Collection();
// const commandFiles = fs
//   .readdirSync("./commands")
//   .filter((file) => file.endsWith(".js"));
// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);
//   client.commands.set(command.name, command);
// }

const app = express();
app.use(express.json());
const port=3002;

const Database = require("@replit/database");
const db = new Database();

app.get("/", (req, res) => res.send("Rob listening at http://localhost:8080"));
// 接收创建服务器的请求
app.post("/discord/createChannel", (req, res) => {
  res.send("createChannel");
  console.log(req.body);
  db.set("nftName", req.body.nftName)
});

// 接收验证结果
app.post("/discord/discordAuth", (req, res) => {
  res.send("createChannel");
  console.log(req.body);
  db.set(`${req.body.userId}`, req.body);
});
// db.delete("928830430172577792");
// db.delete("930991445312163880");
db.list().then(res => console.log(res));


app.listen(port, () =>
  console.log(`Rob listening at http://localhost:8080`)
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
    const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
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

    client.on('interactionCreate', async (interaction) => {
      db.get(`${member.user.id}`).then(async userInfo => {
        console.log(userInfo);
        //校验   member.guild.id===userInfo.guildId && member.user.id === userInfo.userId && 
        if (userInfo) {
          if (userInfo.nftOwner && userInfo.nftFollower) {
            let role = await member.guild.roles.cache.find(role => role.name === "founder");
            if (!role) {
              member.guild.roles.create({
                name: 'founder',
                color: '#ff4000',
                hoist: true,
                permissions: [Permissions.FLAGS.ADMINISTRATOR]
              }).then(role => {
                member.roles.add(role);
              })
            } else {
              member.roles.add(role);
            }
            const embed = new MessageEmbed()
              .setColor('#f542d4')
              .setTitle('✅  Verification successful! Now you can chat freely in your guild!')
              .setDescription('You are the caster')
              .setTimestamp()
              .setFooter({ text: 'PlaNFT' });
            member.user.send({ embeds: [embed] })
            return ;
          } else if (!userInfo.nftOwner && userInfo.nftFollower) {
            let role = await member.guild.roles.cache.find(role => role.name === "follower");
            if (!role) {
              member.guild.roles.create({
                name: 'follower',
                color: '#00ffff',
                hoist: true,
                permissions: [Permissions.FLAGS.VIEW_CHANNEL]
              }).then(role => {
                member.roles.add(role);
              })
            } else {
              member.roles.add(role);
            }
            const embed = new MessageEmbed()
              .setColor('#f542d4')
              .setTitle('✅  Verification successful! Now you can chat freely in your guild!')
              .setDescription('You are the follower')              
              .setTimestamp()
              .setFooter({ text: 'PlaNFT' });
            member.user.send({ embeds: [embed] })

          } else {
            const embed = new MessageEmbed()
              .setColor('#f542d4')
              .setTitle(`❌  Sorry, you're not a follower of the NFT`)
              .setTimestamp()
              .setFooter({ text: 'PlaNFT' });
            member.user.send({ embeds: [embed] })
            member.kick();
          }
        } else {
          const embed = new MessageEmbed()
            .setColor('#f542d4')
            .setTitle(`Please click the link above first`)
            .setTimestamp()
            .setFooter({ text: 'PlaNFT' });
          member.user.send({ embeds: [embed] })
        }
      })
      try{
        await interaction.deferUpdate();
      }catch(err){
        console.log(err)
      }
    })
  } catch (err) {
    console.log(err)
  }

});
client.on("messageCreate",async message =>{
  if (message.author.bot) return;
  if (message.content == ".group") {
    const Guild = await client.guilds.create("test_Guild", {
      channels: [
        { "name": "channel-1" },
      ],
      verification_level:3,

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

client.once("ready", () => {
  console.log("Bot is ready!");
  client.users.cache.tap((coll) => (users = coll.size));
  client.guilds.cache.tap((coll) => (guilds = coll.size));
  const status = [
    {
      activity: "《熊出没》",
      type: "WATCHING",
    },
    {
      activity: `《快乐星球》`,
      type: "WATCHING",
    },
    {
      activity: "CSGO",
      type: "PLAYING",
    },
    {
      activity: "LOL",
      type: "PLAYING",
    },
    {
      activity: "《喜羊羊与灰太狼》",
      type: "WATCHING",
    },
    {
      activity: "Jay Chou.",
      type: "LISTENING",
    },
    {
      activity: "BiliBili.",
      type: "WATCHING",
    },
  ];
  let random = status[Math.floor(Math.random() * Math.floor(status.length))];
  client.user.setActivity(random.activity, {
    type: random.type,
  });
  setInterval(async function() {
    client.users.cache.tap((coll) => (users = coll.size));
    client.guilds.cache.tap((coll) => (guilds = coll.size));
    random = status[Math.floor(Math.random() * Math.floor(status.length))];
    client.user.setActivity(random.activity, {
      type: random.type,
    });
  }, 60000);
});

// let prefix = ".";
// client.on("messageCreate", async (message) => {
//   if (
//     message.content == `<@${client.user.id}>` ||
//     message.content == `<@!${client.user.id}>`
//   )
//     return message.channel.send(`The prefix is \`${prefix}\`.`);

//   const args = message.content.slice(prefix.length).trim().split(/ +/);

//   const commandName = args.shift().toLowerCase();

//   const command =
//     client.commands.get(commandName) ||
//     client.commands.find(
//       (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
//     );
//   if (!command) return;
//   if (command.guildOnly && message.channel.type !== "GUILD_TEXT") {
//     return message.reply("I can't execute that command inside DMs!");
//   }
//   if (command.args && !args.length) {
//     let reply = `You didn't provide any arguments! \n`;

//     if (command.usage) {
//       reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
//     }
//     return message.reply(reply);
//   }
//   try {
//     command.execute(message, args);
//   } catch (error) {
//     console.error(error);
//     message.reply(`执行时发生错误: \n ${error}`);
//   }
// });

client.login('OTMzMjU2MDcxNTU0OTQwOTc5.Yee4cg.kVIS1RsgTHfJOSbARFQN_2yLQFU');
