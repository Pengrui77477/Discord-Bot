const express = require("express");
const discordInfo = require('./service/db/discord_info');
// const userInfo = require('./service/db/discord_userInfo');
const fs = require("fs");
const Discord = require("discord.js");
const { MessageEmbed, Permissions } = Discord;
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
app.post("/discord/createChannel", async (req, res) => {
  console.log(req.body);
  const data = req.body.data;
  const user = req.body.data.val;
  const token = req.body.data.token;
  try {
    const TemplateGuild = client.guilds.cache.get('936435431254413392');
    (await TemplateGuild.fetchTemplates()).forEach(async template => {
      // console.log(template);
      const Guild = await template.createGuild(`${data.title}`);

      //设置机器人自身的角色
      const robRole = Guild.members.cache.get(Guild.ownerId);
      let role = Guild.roles.cache.find(role => role.name === "[BOT]");
      robRole.roles.add(role);

      const GuildChannel = Guild.channels.cache.find(channel => channel.name == "🔮portal");
      const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
      console.log(Invite.url);

      //通过OAuth2将成员自动拉进服务器
      await Guild.members.add(user.id,{
        accessToken:token.access_token,
        nick:null,
        mute:false,
        deaf:false
      })
        .then(g => console.log(g))
        .catch(console.error);



      const info = {
        guild_id: Guild.id,
        guild_name: Guild.name,
        invite_link: Invite.url,
        chain_symbol: data.chainSymbol,
        contract_address: data.contractAddress,
        mint_name: user.username,
        user_id: user.id,
        access_token: token.access_token
      };
      await discordInfo.setInfo(info);
      res.send(info);
    });
  } catch (err) {
    console.log(err)
  }

  //第二版 创建频道
  // try {
  //   const Guild = client.guilds.cache.get('940920098577870888');
  //   await Guild.channels.create(`Test-PlaNFT-channel-${data.title}`, {
  //     type: 'GUILD_CATEGORY',
  //     permissionOverwrites: [{
  //       id: Guild.id,
  //       deny: ['VIEW_CHANNEL'],
  //     }]
  //   })
  //     .then(categoryChannel => {
  //       const member = Guild.members.cache.get('928445836004831294');
  //       if (!categoryChannel.permissionsFor(member).has("VIEW_CHANNEL")) {
  //         categoryChannel.permissionOverwrites.create(message.author, {
  //           'VIEW_CHANNEL': true,
  //           // 'EMBED_LINKS': null,
  //           // 'ATTACH_FILES': false,
  //         })
  //       }
  //       categoryChannel.createChannel(`${data.title}`, {
  //         type: 'GUILD_TEXT',
  //         permissionOverwrites: [{
  //           id: Guild.id,
  //           // deny: ['VIEW_CHANNEL'],
  //         }]
  //       })
  //         .then(async channel => {
  //           await channel.lockPermissions();
  //         })
  //     })
  // } catch (err) {
  //   console.log(err);
  // }
});

// 接收验证结果
app.post("/discord/discordAuth", async (req, res) => {
  res.send("createChannel");
  console.log(req.body)

  const Guild = client.guilds.cache.get(req.body.guildId);
  // const member = await Guild.members.fetch(req.body.userId);
  const member = Guild.members.cache.get(req.body.userId);

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
        // userInfo.setInfo(member);
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

    //超过一定时间未验证成功，踢出
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

// client.on('guildMemberRemove', async member => {
//   userInfo.delInfo(member);

// })

//定时操作，避免过久未响应宕机
setInterval(() => {
  console.log('refresh...')
}, 30000);

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

  if (message.content === ".createCategoryChannel") {
    await message.guild.channels.create(`nft-1`, {
      type: 'GUILD_CATEGORY',
      permissionOverwrites: [{
        id: message.guild.id,
        deny: ['VIEW_CHANNEL'],
      }]
    })
      .then(channel => {
        channel.createChannel('Text-1', {
          type: 'GUILD_TEST',
          permissionOverwrites: [{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          }]
        });

        // channel.setPosition(2)
        //   .then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
        //   .catch(console.error);
      })
  }
  if (message.content == ".createguild") {
    const Guild = await client.guilds.create("Test-PlaNFT-Guild", {
      channels: [
        { "name": "channel-1" },
      ],
      roles
    });
    const GuildChannel = Guild.channels.cache.find(channel => channel.name == "channel-1");
    const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
    message.channel.send(`邀请您进群: ${Invite.url}`);
  };

  if (message.content == ".leave") {
    message.guild.leave()
      .then(g => console.log(`Left the guild : ${g}`))
      .catch(console.error);
  }

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

// setInterval(async ()=>{
//   const TestGuild = client.guilds.cache.get('940819652915920996');
//   await TestGuild.channels.create(`Test-PlaNFT-channel-${(Math.random()*100).toFixed()}`, {
//     type: 'GUILD_CATEGORY',
//     permissionOverwrites: [{
//       id: TestGuild.id,
//       // deny: ['VIEW_CHANNEL'],
//     }]
//   })
//     .then(channel => { console.log(`Created the channel : ${channel.id}`) })
//     .catch(console.error);
// },1000)

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
