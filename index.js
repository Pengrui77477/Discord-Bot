const express = require("express");
const discordInfo = require('./service/db/discord_info');
// const userInfo = require('./service/db/discord_userInfo');
const fs = require("fs");
const Discord = require("discord.js");
const { MessageEmbed, Permissions, Shard } = Discord;
const intent = [
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS',
];
const client = new Discord.Client({ intents: intent });
const client1 = new Discord.Client({ intents: intent });
const client2 = new Discord.Client({ intents: intent });
const client3 = new Discord.Client({ intents: intent });
const app = express();
app.use(express.json());
const port = 3002;
app.get("/", (req, res) => res.send("hello world"));
app.listen(port, () =>
  console.log(`Rob listening at http://localhost:${port}`)
);

setInterval(() => {
  console.log('refresh...')
}, 30000);

// 接收创建服务器的请求
app.post("/discord/createChannel", async (req, res) => {
  console.log(req.body);
  const data = req.body;
  try {
    let bot1 = [];
    let bot2 = [];
    let bot3 = [];
    client1.guilds.cache.forEach(async g => {
      bot1.push(g.id);
    });
    client2.guilds.cache.forEach(async g => {
      bot2.push(g.id);
    })
    client3.guilds.cache.forEach(async g => {
      bot3.push(g.id);
    })
    console.log("bot1: " + bot1.length, "bot2: " + bot2.length);
    if (bot1.length < 10) {
      const TemplateGuild = client1.guilds.cache.get('936435431254413392');
      (await TemplateGuild.fetchTemplates()).forEach(async template => {
        // console.log(template);
        const guildName = (data.collectionName.split('from'))[0]
        const Guild = await template.createGuild(`${guildName}`);

        //设置机器人自身的角色
        // const robRole = Guild.members.cache.get(Guild.ownerId);
        // let role = Guild.roles.cache.find(role => role.name === "[BOT]");
        // robRole.roles.add(role);

        const GuildChannel = Guild.channels.cache.find(channel => channel.name == "🔮portal");
        const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
        console.log(Invite.url);

        const info = {
          code: '200',
          data: {
            guild_id: Guild.id,
            invite_link: Invite.url,
            guild_name: data.collectionName,
            chain_symbol: data.chainSymbol,
            contract_address: data.contractAddress,
          },
          message: "success",
          status: true
        };
        await discordInfo.setInfo(info.data);
        res.send(info);
      });
    } else if (bot2.length < 10) {
      const TemplateGuild = client2.guilds.cache.get('936435431254413392');
      (await TemplateGuild.fetchTemplates()).forEach(async template => {
        // console.log(template);
        const guildName = (data.collectionName.split('from'))[0]
        const Guild = await template.createGuild(`${guildName}`);

        //设置机器人自身的角色
        // const robRole = Guild.members.cache.get(Guild.ownerId);
        // let role = Guild.roles.cache.find(role => role.name === "[BOT]");
        // robRole.roles.add(role);

        const GuildChannel = Guild.channels.cache.find(channel => channel.name == "🔮portal");
        const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
        console.log(Invite.url);

        const info = {
          code: '200',
          data: {
            guild_id: Guild.id,
            invite_link: Invite.url,
            guild_name: data.collectionName,
            chain_symbol: data.chainSymbol,
            contract_address: data.contractAddress,
          },
          message: "success",
          status: true
        };
        await discordInfo.setInfo(info.data);
        res.send(info);
      });
    } else if (bot3.length < 10) {
      const TemplateGuild = client3.guilds.cache.get('936435431254413392');
      (await TemplateGuild.fetchTemplates()).forEach(async template => {
        // console.log(template);
        const guildName = (data.collectionName.split('from'))[0]
        const Guild = await template.createGuild(`${guildName}`);

        //设置机器人自身的角色
        // const robRole = Guild.members.cache.get(Guild.ownerId);
        // let role = Guild.roles.cache.find(role => role.name === "[BOT]");
        // robRole.roles.add(role);

        const GuildChannel = Guild.channels.cache.find(channel => channel.name == "🔮portal");
        const Invite = await GuildChannel.createInvite({ maxAge: 0, unique: true, reason: "Testing." });
        console.log(Invite.url);

        const info = {
          code: '200',
          data: {
            guild_id: Guild.id,
            invite_link: Invite.url,
            guild_name: data.collectionName,
            chain_symbol: data.chainSymbol,
            contract_address: data.contractAddress,
          },
          message: "success",
          status: true
        };
        await discordInfo.setInfo(info.data);
        res.send(info);
      });
    }


  } catch (err) {
    console.log(err)
  }
});

app.post("/discord/inviteMember", async (req, res) => {
  console.log(req.body);
  const userInfo = req.body.userInfo;
  const tokenList = req.body.token;

  if (!userInfo || !tokenList) return;
  const info = {
    guild_id: req.body.guildId,
    mint_name: userInfo.username,
    user_id: userInfo.id,
    access_token: tokenList.access_token
  }
  console.log(info);
  await discordInfo.updateInfo(info);

  //谁创建的服务器就让谁拉

  //通过OAuth2将成员自动拉进服务器
  let Guild = client1.guilds.cache.get(req.body.guildId);
  if (!Guild) Guild = client2.guilds.cache.get(req.body.guildId);
  if (!Guild) Guild = client3.guilds.cache.get(req.body.guildId);
  if (!Guild) return;
  await Guild.members.add(userInfo.id, {
    accessToken: tokenList.access_token,
    nick: null,
    mute: false,
    deaf: false
  })
    .then(g => console.log(`Successfully pulled the user in : ${g}`))
    .catch(console.error);
});


// 接收验证结果
app.post("/discord/discordAuth", async (req, res) => {
  res.send("createChannel");
  console.log(req.body)

  let Guild = client.guilds.cache.get(req.body.guildId);
  // const member = await Guild.members.fetch(req.body.userId);
  if (!Guild) Guild = client1.guilds.cache.get(req.body.guildId);
  if (!Guild) Guild = client2.guilds.cache.get(req.body.guildId);
  if (!Guild) Guild = client3.guilds.cache.get(req.body.guildId);
  if (!Guild) return;
  // switch (req.body.guildId) {
  //   case client.guilds.cache.forEach(g => {
  //     return g.id
  //   }):
  //     Guild = client.guilds.cache.get(req.body.guildId);
  //     break;
  //   case 1:
  //     Guild = client1.guilds.cache.get(req.body.guildId);
  //     break;
  //   case 2:
  //     Guild = client2.guilds.cache.get(req.body.guildId);
  //     break;
  //   case 3:

  //     break;
  //   default:
  //     break;
  // }
  const member = Guild.members.cache.get(req.body.userId);

  //如果用户存在当前服务器
  if (member) {

    //目前简单判断
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
  const verifyUrl = `http://192.168.50.77:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
  // const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
  const Embed = new MessageEmbed()
    .setColor('#f542d4')
    .setTitle(`Welcome to the plaNFT 👋`)
    .addFields(
      { name: ' 👇 Please click the link below to verify', value: `${verifyUrl}` },
    )
    .setTimestamp()
    .setFooter({ text: 'PlaNFT' });
  member.user.send({ ephemeral: true, embeds: [Embed] });
})

client1.on('guildMemberAdd', async member => {
  if (member.user.bot) return;

  try {
    const { user_id, guild_id } = await discordInfo.getInfo(member.guild.id);
    // console.log('user_id', user_id);
    if (member.user.id === user_id) {
      const Guild = member.guild;
      let role = Guild.roles.cache.find(role => role.name === "[MOD]");
      if (!role) {
        Guild.roles.create({
          name: '[MOD]',
          color: '#c45923',
          hoist: true,
          permissions: [Permissions.FLAGS.ADMINISTRATOR]
        }).then(role => {
          member.roles.add(role);
        });
      } else {
        member.roles.add(role);
      }
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setLabel('Invite')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=928483162496045108&permissions=8&scope=bot')
            .setStyle('LINK')
        );
      const some = 'If you want to continue using this server, please click to invite our robot to serve you';
      const Embed = new MessageEmbed()
        .setColor('#f542d4')
        .setTitle(`Welcome to the plaNFT 👋`)
        .addFields(
          { name: ' 👇 Please click the link below to Invite our bot', value: `${some}` },
        )
        .setTimestamp()
        .setFooter({ text: 'PlaNFT' });
      member.user.send({ ephemeral: true, embeds: [Embed], components: [row] });

      setTimeout(async () => {
        await Guild.setOwner(member.user)
          .then(guild => guild.fetchOwner())
          .then(owner => console.log(`Update the owner :${owner}`));

        await member.guild.leave()
          .then(g => console.log(`Left the guild : ${g}`))
          .catch(console.error);
      }, 2000);
    } else {
      //机器人发送私信
      const verifyUrl = `http://192.168.50.77:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      // const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      const Embed = new MessageEmbed()
        .setColor('#f542d4')
        .setTitle(`Welcome to the plaNFT 👋`)
        .addFields(
          { name: ' 👇 Please click the link below to verify', value: `${verifyUrl}` },
        )
        .setTimestamp()
        .setFooter({ text: 'PlaNFT' });
      member.user.send({ ephemeral: true, embeds: [Embed] });
    }
  } catch (error) {
    console.log(error)
  }
});
client2.on('guildMemberAdd', async member => {
  if (member.user.bot) return;

  try {
    const { user_id, guild_id } = await discordInfo.getInfo(member.guild.id);
    // console.log('user_id', user_id);
    if (member.user.id === user_id) {
      const Guild = member.guild;
      let role = Guild.roles.cache.find(role => role.name === "[MOD]");
      if (!role) {
        Guild.roles.create({
          name: '[MOD]',
          color: '#c45923',
          hoist: true,
          permissions: [Permissions.FLAGS.ADMINISTRATOR]
        }).then(role => {
          member.roles.add(role);
        });
      } else {
        member.roles.add(role);
      }
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setLabel('Invite')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=928483162496045108&permissions=8&scope=bot')
            .setStyle('LINK')
        );
      const some = 'If you want to continue using this server, please click to invite our robot to serve you';
      const Embed = new MessageEmbed()
        .setColor('#f542d4')
        .setTitle(`Welcome to the plaNFT 👋`)
        .addFields(
          { name: ' 👇 Please click the link below to Invite our bot', value: `${some}` },
        )
        .setTimestamp()
        .setFooter({ text: 'PlaNFT' });
      member.user.send({ ephemeral: true, embeds: [Embed], components: [row] });

      setTimeout(async () => {
        await Guild.setOwner(member.user)
          .then(guild => guild.fetchOwner())
          .then(owner => console.log(`Update the owner :${owner}`));

        await member.guild.leave()
          .then(g => console.log(`Left the guild : ${g}`))
          .catch(console.error);
      }, 2000);
    } else {
      //机器人发送私信
      const verifyUrl = `http://192.168.50.77:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      // const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      const Embed = new MessageEmbed()
        .setColor('#f542d4')
        .setTitle(`Welcome to the plaNFT 👋`)
        .addFields(
          { name: ' 👇 Please click the link below to verify', value: `${verifyUrl}` },
        )
        .setTimestamp()
        .setFooter({ text: 'PlaNFT' });
      member.user.send({ ephemeral: true, embeds: [Embed] });
    }
  } catch (error) {
    console.log(error)
  }
});
client3.on('guildMemberAdd', async member => {
  if (member.user.bot) return;

  try {
    const { user_id, guild_id } = await discordInfo.getInfo(member.guild.id);
    // console.log('user_id', user_id);
    if (member.user.id === user_id) {
      const Guild = member.guild;
      let role = Guild.roles.cache.find(role => role.name === "[MOD]");
      if (!role) {
        Guild.roles.create({
          name: '[MOD]',
          color: '#c45923',
          hoist: true,
          permissions: [Permissions.FLAGS.ADMINISTRATOR]
        }).then(role => {
          member.roles.add(role);
        });
      } else {
        member.roles.add(role);
      }
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setLabel('Invite')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=928483162496045108&permissions=8&scope=bot')
            .setStyle('LINK')
        );
      const some = 'If you want to continue using this server, please click to invite our robot to serve you';
      const Embed = new MessageEmbed()
        .setColor('#f542d4')
        .setTitle(`Welcome to the plaNFT 👋`)
        .addFields(
          { name: ' 👇 Please click the link below to Invite our bot', value: `${some}` },
        )
        .setTimestamp()
        .setFooter({ text: 'PlaNFT' });
      member.user.send({ ephemeral: true, embeds: [Embed], components: [row] });

      setTimeout(async () => {
        await Guild.setOwner(member.user)
          .then(guild => guild.fetchOwner())
          .then(owner => console.log(`Update the owner :${owner}`));

        await member.guild.leave()
          .then(g => console.log(`Left the guild : ${g}`))
          .catch(console.error);
      }, 2000);
    } else {
      //机器人发送私信
      const verifyUrl = `http://192.168.50.77:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      // const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      const Embed = new MessageEmbed()
        .setColor('#f542d4')
        .setTitle(`Welcome to the plaNFT 👋`)
        .addFields(
          { name: ' 👇 Please click the link below to verify', value: `${verifyUrl}` },
        )
        .setTimestamp()
        .setFooter({ text: 'PlaNFT' });
      member.user.send({ ephemeral: true, embeds: [Embed] });
    }
  } catch (error) {
    console.log(error)
  }
});

client.once("ready", () => {
  console.log(`验证机器人启动成功!`);
});
client1.once("ready", () => {
  console.log(`建群机器人-1 启动成功!`);
});
client2.once("ready", () => {
  console.log(`建群机器人-2 启动成功!`);
})
client3.once("ready", () => {
  console.log(`建群机器人-3 启动成功!`);
})


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
      })
  }
  if (message.content == ".createguild") {
    const Guild = await client1.guilds.create("Test-PlaNFT-Guild", {
      channels: [
        { "name": "channel-1" },
      ],
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
    const num1 = client1.guilds.cache;
    const num2 = client.guilds.cache;
    let res = [];
    num2.forEach(async n => {
      res.push(n.id);
    })
    console.log(res.length);
  }
  if (message.content.includes(".del")) {

    const res = message.content.split(" ").reverse();
    const Guild = client1.guilds.cache.get(res[0]);
    if (Guild) {
      Guild.delete()
        .then(g => {
          console.log(`delete the guild: ${g}`);
          message.channel.send(`delete the guild: ${g}`);
          discordInfo.updateStatus(g);
        })
        .catch(console.error);
    }
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

//验证用 机器人
client.login(process.env.token);

//建群用 机器人
client1.login(process.env.token1);
client2.login(process.env.token2);
client3.login(process.env.token3);
