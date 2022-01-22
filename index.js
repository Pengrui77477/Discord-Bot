const express = require("express");
const Discord = require("discord.js");

const fs = require("fs");
const admin = require("firebase-admin");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const intent = [
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS',
];
const client = new Discord.Client({ intents: intent });
// const axios = require('axios');

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
let prefix = ".";

const app = express();
app.use(express.json());

const Database = require("@replit/database");
const dataBase = new Database();

app.get("/", (req, res) => res.send("Hello world!"));
// 接收创建服务器的请求
app.post("/createChannel", (req, res) => {
  res.send("createChannel");
  console.log(req.body);
  dataBase.set("nftName",req.body.nftName)
});

// dataBase.list().then(res=> console.log(res));

// 接收验证结果
app.post("/discordAuth", (req, res) => {
  res.send("createChannel");
  console.log(req.body);
  dataBase.set("userInfo",req.body);
  
});
dataBase.get("nftName").then(value =>console.log(value));
dataBase.get("userInfo").then(value =>console.log(value));


client.on('guildMemberAdd', async member => {
  if (member.user.bot) return;
  const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
        .setCustomId(`deletable`)
        .setLabel('verify')
        .setStyle('PRIMARY')
    );
  const verifyUrl = `http://192.168.50.91:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
  const embed = new MessageEmbed()
    .setColor('#f542d4')
    .setTitle(`Welcome \`${member.user.username}\` to the PlaNFT Guild `)
    .setDescription(`Please click the button below to obtain permission`)
    .setTimestamp()
    .setFooter({ text: 'PlaNFT' });

  const sendChannel = member.guild.channels.cache.get('930041271748284449');
  if (sendChannel) {
    sendChannel.send({ ephemeral: true, embeds: [embed], components: [row] });
  }

  client.once('interactionCreate', async (interaction) => {

    // axios.post('https://myBots.prbot.repl.co/discordAuth', {
    //   userId: interaction.user.id,
    //   guildId: interaction.guildId,
    //   nftOwner: 1,
    //   nftFollower: 0
    // })
    //   .then((res) => console.log(`${res.config.data} is sended`))
    // axios.get(`http://192.168.50.91:8082/authDiscord?userId=${interaction.user.id}&guildId=${interaction.guildId}`)
    //   .then(res=>console.log(res))
    // app.post("/discordAuth", (req, res) => {

    // if (interaction.user.id === req.body.userId && interaction.guildId === req.body.guildId && req.body.nftOwner) {
    console.log('member.user.id' + '---' + member.user.id);
    console.log('interaction.user.id' + '---' + interaction.user.id);

    dataBase.get("userInfo").then(userInfo =>{
      //校验
      if (member.user.id === userInfo.userId && userInfo.nftOwner) {
        console.log('up')
        dataBase.get("nftName").then(async value => {
          await member.guild.channels.create(`Test-PlaNFT-${value}`, {
            type: 'GUILD_TEXT',
            // permissionOverwrites: [{
            //   id: member.guild.id,
            //   deny: ['VIEW_CHANNEL'],
            // }]
          })
            .then(async channel => {
              const categoryId = '933323621827510302';
              channel.setParent(categoryId);
              //设置铸造者的角色
              var role = member.guild.roles.cache.find(role => role.name === "founder");
              member.roles.add(role);

              //在创建的私密频道内设置铸造者的权限
              if (channel) {
                await channel.permissionOverwrites.create(member.user, {
                  VIEW_CHANNEL: true,
                  MANAGE_CHANNELS: true
                })
                  .then(channel => console.log(channel.permissionOverwrites.cache.get(member.user.id)))
                  .catch(console.error);
              }

              //创建新的服务器
              try {
                const Guild = await client.guilds.create(`PlaNFT-${value}-guild`, {
                  channels: [
                    { "name": "channel-1" },
                    { "name": "channel-2" },
                  ]
                });
                const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
                const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
                await channel.send(`Here is a new server. Click join:${Invite.url}`);

                //将创建的服务器信息插入数据库
                dataBase.set(`PlaNFT-${value}-guildId`, Guild.id);
                dataBase.set(`PlaNFT-${value}-channelId`, GuildChannel.id);

                try {

                  setTimeout(async () => {
                    if (Guild.memberCount == 1) {
                      await Guild.delete()
                        .then(g => console.log(`Deleted the guild ${g}`))
                        .catch(console.error);
                    }
                  }, 30000);

                } catch (err) {
                  console.log(err)
                }

              } catch (err) {
                console.log(err)
              }

              //将创建的私密频道插入数据库
              dataBase.set(`Test-PlaNFT-${value}`, channel.id);

            })
        });
      //检验   !userInfo.nftOwner && userInfo.nftFollower
      // } else if(!userInfo.nftOwner || userInfo.nftFollower){
      } else{
        console.log('down')
        dataBase.get("nftName").then(async value => {
          dataBase.get(`Test-PlaNFT-${value}`).then(channelId => {
            const channel = member.guild.channels.cache.get(channelId);
            if (channel) {
              channel.permissionOverwrites.create(member.user, {
                VIEW_CHANNEL: true,
              })
                .then(channel => console.log(channel.permissionOverwrites.cache.get(member.user.id)))
                .catch(console.error);
            }
          });
        });
      }
    })

    // });//app.post()
    interaction.deferUpdate()
      .then(console.log('OK!'))
      .catch(console.error);
  });

  try {
    const sendUrl='https://test.planft.com/';
    const Embed = new MessageEmbed()
      .setColor('#f542d4')
      .setTitle('Welcome to the plaNFT')
      .setDescription(`Following notice is important, so please take minutes to read it:\nIf it is possible, please turn off DMs from our channel, as numerous scammers will send you malicious messages. Be distinguished about plaNFT moderators and bots, and they will never DM you except this one. Any unsolicitehd DMs, you can report them  to our channel. Hope you can enjoy yourself here on the plaNFT. \nThank you!`)
      .addField('Enter our official website', `${sendUrl}`, true)
      .setTimestamp()
      .setFooter({ text: 'PlaNFT' });
    member.user.send({ embeds: [Embed] });
  } catch (err) {
    console.log(err)
  }
});

client.on("guildMemberAdd", async member => {
  dataBase.get("nftName").then(async value => {
    dataBase.get(`PlaNFT-${value}-guildId`).then(async guildId => {
      if (member.guild.id === guildId) {
        if (member.user.id === '930991445312163880') {
          // if(member.user.id==='930991445312163880')
          console.log("hello!")
          const Guild = await client.guilds.cache.get(guildId);
          const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
          setTimeout(async () => {
            if (Guild.members.cache.get("930991445312163880")) {
              const nftOwner = Guild.members.cache.get("930991445312163880");
              GuildChannel.send(`Now I will to transfer the guild to \`@${nftOwner.user.username}\``);
              setTimeout(async () => {
                await Guild.setOwner(nftOwner.user)
                  .then(guild => guild.fetchOwner())
                  .then(owner => console.log(`Update the owner :${owner}`));
              }, 7000);
            } else {
              GuildChannel.send('没有找到这个人');
            }
          }, 5000);
        }
      }
    });
  })
});


app.listen(8080, () =>
  console.log(`Rob listening at http://localhost:8080`)
);



admin.initializeApp({
  credential: admin.credential.cert({
    project_id: "roboliam-427c0",
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});



// client.on("guildMemberAdd", async (member) => {
//   try {

//     //在指定的服务器下
//     if (member.guild.id === "930041271748284446") {
//       if (member.user.bot) return;
//       const verifyUrl = `http://192.168.50.91:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
//       try {
//         const Embed = new MessageEmbed()
//           .setColor('#f542d4')
//           .setTitle('Welcome to the plaNFT')
//           .setURL('https://test.planft.com/')
//           .setDescription(`Following notice is important, so please take minutes to read it:\nIf it is possible, please turn off DMs from our channel, as numerous scammers will send you malicious messages. Be distinguished about plaNFT moderators and bots, and they will never DM you except this one. Any unsolicitehd DMs, you can report them  to our channel. Hope you can enjoy yourself here on the plaNFT. Thank you!`)
//           .addField('Please click to verify', `${verifyUrl}`, true)
//           .setTimestamp()
//           .setFooter({ text: 'PlaNFT' });
//         member.user.send({ embeds: [Embed] });
//       } catch (err) {
//         console.log(err)
//       }
//       //判断是哪个nft系列的成员
//       // if(member.user.bot){

//       //判断是否为该nft系列的铸造者
//       if (member.user.id === "930991445312163880") {
//         // const sendChannel = member.guild.channels.cache.get('930041271748284449');
//         dataBase.get("nftName").then(async value => {

//           //创建私密频道
//           await member.guild.channels.create(`Test-PlaNFT-${value}`, {
//             type: 'GUILD_TEXT',
//             permissionOverwrites: [{
//               id: member.guild.id,
//               deny: ['VIEW_CHANNEL'],
//             }]
//           })
//             .then(async (channel) => {
//               // const categoryId = '933323621827510302';
//               // channel.setParent(categoryId);

//               //发送邀请
//               // try {
//               //   let invite = await channel.createInvite({
//               //     maxAge: 0,
//               //     maxUses: 1,
//               //   })
//               //     .catch(() => { console.log; });
//               //   sendChannel.send(`Welcome PlaNFT!\n To accept, click on the following invite! ${invite}`);
//               // } catch (err) {
//               //   console.log(err);
//               // };

//               //设置铸造者的角色
//               var role = member.guild.roles.cache.find(role => role.name === "founder");
//               member.roles.add(role);

//               //在创建的私密频道内设置铸造者的权限
//               channel.permissionOverwrites.create(member.user, {
//                 VIEW_CHANNEL: true,
//                 //管理频道
//                 MANAGE_CHANNELS: true,
//               })
//                 .then(channel => console.log(channel.permissionOverwrites.cache.get(member.user.id)))
//                 .catch(console.error);

//               //创建新的服务器
//               try {
//                 const Guild = await client.guilds.create(`PlaNFT-${value}-guild`, {
//                   channels: [
//                     { "name": "channel-1" },
//                     { "name": "channel-2" },
//                   ]
//                 });
//                 const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
//                 const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
//                 await channel.send(`Here is a new server. Click join:${Invite.url}`);

//                 //将创建的服务器信息插入数据库
//                 dataBase.set(`PlaNFT-${value}-guildId`, Guild.id);
//                 dataBase.set(`PlaNFT-${value}-channelId`, GuildChannel.id);

//                 try {
//                   setTimeout(async () => {
//                     await Guild.delete()
//                       .then(g => console.log(`Deleted the guild ${g}`))
//                       .catch(console.error);
//                   }, 20000);
//                 } catch (err) {
//                   console.log(err)
//                 }

//               } catch (err) {
//                 console.log(err)
//               }

//               //将创建的私密频道插入数据库
//               dataBase.set(`Test-PlaNFT-${value}`, channel.id);

//             })
//         })
//         //nft其他成员
//       } else {
//         dataBase.get("nftName").then(async value => {
//           dataBase.get(`Test-PlaNFT-${value}`).then(channelId => {
//             const channel = member.guild.channels.cache.get(channelId);
//             if (channel) {
//               channel.permissionOverwrites.create(member.user, {
//                 VIEW_CHANNEL: true,
//               })
//                 .then(channel => console.log(channel.permissionOverwrites.cache.get(member.user.id)))
//                 .catch(console.error);
//             }
//           });
//         });
//         // dataBase.list().then(value=>{
//         //   console.log(value)
//         // });

//       }
//       // }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });
// // setGuildOwner();
// client.on("guildMemberAdd", async member => {
//   dataBase.get("nftName").then(async value => {
//     dataBase.get(`PlaNFT-${value}-guildId`).then(async guildId => {
//       if (member.guild.id === guildId) {
//         if (member.user.id === '930991445312163880') {
//           // if(member.user.id==='930991445312163880')
//           console.log("hello!")
//           const Guild = await client.guilds.cache.get(guildId);
//           const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
//           setTimeout(async () => {
//             if (Guild.members.cache.get("930991445312163880")) {
//               const nftOwner = Guild.members.cache.get("930991445312163880");
//               GuildChannel.send(`Now I will to transfer the server to \`@${nftOwner.user.username}\``);
//               setTimeout(async () => {
//                 await Guild.setOwner(nftOwner.user)
//                   .then(guild => guild.fetchOwner())
//                   .then(owner => console.log(`Update the owner :${owner}`));
//               }, 7000);
//             } else {
//               GuildChannel.send('没有找到这个人');
//             }
//           }, 5000);
//         }
//       }
//     });
//   })
// });

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
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(`执行时发生错误： \n ${error}`);
  }
});

client.login(process.env.token2);
