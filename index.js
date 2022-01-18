const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello world!"));
// 接收创建服务器的请求
app.get("/createChannel", (req, res) => {
  console.log(req.query);
});
// 接收验证结果
app.get("/discordAuth", (req, res) => {
  console.log(req.query);
  res.send("discordAuth")
});
app.listen(8080, () =>
  console.log(`Rob listening at http://localhost:8080`)
);
// const fetch = require("node-fetch");
// import fetch from "node-fetch";
const Discord = require("discord.js");
intent = [
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS',
];
const client = new Discord.Client({ intents: intent });
const { MessageEmbed } = require("discord.js");

const fs = require("fs");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: "roboliam-427c0",
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});
let db = admin.firestore();
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
let prefix = ".";

client.once("ready", () => {
  // let users;
  // let guilds;
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
  setInterval(async function () {
    client.users.cache.tap((coll) => (users = coll.size));
    client.guilds.cache.tap((coll) => (guilds = coll.size));
    random = status[Math.floor(Math.random() * Math.floor(status.length))];
    client.user.setActivity(random.activity, {
      type: random.type,
    });
  }, 60000);
});
const Database = require("@replit/database");
const dataBase = new Database();

client.on("guildMemberAdd", async (member) => {
  try {

    //在指定的服务器下
    if (member.guild.id === "930041271748284446") {

      //判断是否为nft系列的铸造者
      if (member.user.id === "930991445312163880") {
        dataBase.get("nftName").then(value => {
          await member.guild.channels.create(`PlaNFT-${value}`, {
            type: 'GUILD_TEXT',
          })
            .then(async (channel) => {
              const categoryId = '930765258023395358';
              channel.setParent(categoryId);

              //发送邀请
              try {
                let invite = await channel.createInvite({
                  maxAge: 0,
                  maxUses: 1,
                })
                  .catch(() => { console.log; });
                sendChannel.send(`Welcome PlaNFT!\n To accept, click on the following invite! ${invite}`);
              } catch (err) {
                console.log(err);
              };

              //设置铸造者的角色
              var role = member.guild.roles.cache.find(role => role.name === "founder");
              member.roles.add(role);

              //在创建的私密频道内设置铸造者的权限
              channel.permissionOverwrites.create(member.user, {
                VIEW_CHANNEL: true,
                //管理频道
                MANAGE_CHANNELS: true,
              })
                .then(channel => console.log(channel.permissionOverwrites.cache.get(member.user.id)))
                .catch(console.error);

              //将创建的私密频道插入数据库
              dataBase.set(`PlaNFT-${value}-channel`, channel.id).then(() => {
                console.log(`PlaNFT-${value}-channel is inserted!`);
              })
            })
        })

        //nft其他成员
      } else {
        dataBase.get(`PlaNFT-${value}-channel`).then(value => {
          const channel = member.guild.channels.cache.get(value);
          channel.permissionOverwrites.create(member.user, {
            VIEW_CHANNEL: true,

          })
            .then(channel => console.log(channel.permissionOverwrites.cache.get(member.user.id)))
            .catch(console.error);
        });
        // dataBase.list().then(value=>{
        //   console.log(value)
        // });

      }
    }
    //930991445312163880
    //根据nft系列信息创建新服务器
    if (member.guild.id === "930041271748284446") {
      const sendChannel = member.guild.channels.cache.get('930041271748284449');
      if (member.user.id === "930991445312163880") {
        const Guild = await client.guilds.create("test_PlaNFT", {
          channels: [
            { "name": "channel-1" },
            { "name": "channel-2" },
          ]
        });
        const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
        dataBase.set("test_PlaNFT_guildId", Guild.id);
        dataBase.set("test_PlaNFT_channelId", GuildChannel.id);
        const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
        sendChannel.send(`Here is a new server. Click join:${Invite.url}`);

      }
    }

  } catch (err) {
    console.log(err);
  }

  if (member.user.bot) return;
  if (client.id !== "927771963655598080") return;
  try {
    const Embed = new MessageEmbed()
      .setTitle('Welcome to the plaNFT Discord Channel')
      .setColor('#f542d4')
      .setDescription(`Following notice is important, so please take minutes to read it:\n
        If it is possible, please turn off DMs from our channel, as numerous scammers will send you malicious messages.\n
        Be distinguished about plaNFT moderators and bots, and they will never DM you except this one.\n
        Any unsolicitehd DMs, you can report them  to our channel.\n
        Hope you can enjoy yourself here on the plaNFT \n
        Thank you!\n`)
      .setFooter(`PlaNFT`);
    member.user.send({ embeds: [Embed] });
  } catch (err) {
    console.log(err)
  }
});

// setGuildOwner();
client.on("guildMemberAdd", async member => {
  dataBase.get("test_PlaNFT_guildId").then(async value => {
    
    if (member.guild.id === value) {
      if(member.user.id==='930991445312163880'){
      // if(member.user.id==='930991445312163880')
        console.log("hello!")
        const Guild = await client.guilds.cache.get(value);
        const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
        setTimeout(async () => {
          if (Guild.members.cache.get("930991445312163880")) {
            const nftOwner = Guild.members.cache.get("930991445312163880");
            GuildChannel.send(`Now I will to transfer the server to \`@${nftOwner.user.username}\``);
            setTimeout(async ()=>{
              await Guild.setOwner(nftOwner.user)
              .then(guild => guild.fetchOwner())
              .then(owner => console.log(`Update the owner :${owner}`));
            },7000);
          } else {
            GuildChannel.send('没有找到这个人');
          }
        }, 5000);
      }
    }
  });
});


client.on("messageCreate", async message => {
  // const reg=["fuck","我操你妈","nmsl"]
  // console.log(message.channel);
  if (message.content.includes("fuck")) {
    // const member = message;
    const member = message.guild.members.cache.get(message.author.id);
    // console.log(member)
    member.kick().then(() => {
      const Embed = new MessageEmbed()
        .setTitle(`${member.user.username} has been kicked out`)
        .setDescription(`${member} violates the regulations and makes improper remarks.`)
        // .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({ embeds: [Embed] });
    })
      .catch((err) => {
        message.channel.send(
          `❌ I was unable to kick the user ${member.user.username}.`
        );
        console.log(err);
      });
  }
});
client.on("messageCreate", async (message) => {
  let doc;
  if (message.guild) {
    doc = message.guild.id;
  } else {
    doc = "NULL";
  }
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
    command.execute(message, args, db);
  } catch (error) {
    console.error(error);
    message.reply(`执行时发生错误： \n ${error}`);
  }
});

client.login(process.env.token);
