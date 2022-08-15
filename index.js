const express = require("express");
const discordInfo = require('./service/db/discord_info');
const userInfo = require('./service/db/discord_userInfo');
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
const client4 = new Discord.Client({ intents: intent });
const client5 = new Discord.Client({ intents: intent });
const app = express();
app.use(express.json());
const port = 3002;
app.get("/", (req, res) => res.send("hello world"));
app.listen(port, () =>
  console.log(`Rob listening at http://10.0.0.18:${port}`)
);

setInterval(() => {
  console.log('refresh...');
}, 30000);

app.post("/discord/createChannel", async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    let bot1 = [];
    let bot2 = [];
    let bot3 = [];
    let bot4 = [];
    let bot5 = [];
    client1.guilds.cache.forEach(async g => {
      bot1.push(g.id);
    });
    client2.guilds.cache.forEach(async g => {
      bot2.push(g.id);
    })
    client3.guilds.cache.forEach(async g => {
      bot3.push(g.id);
    })
    client4.guilds.cache.forEach(async g => {
      bot4.push(g.id);
    })
    client5.guilds.cache.forEach(async g => {
      bot5.push(g.id);
    })

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
            client_id: "933256071554940979",
            client_secret: "Zm3Or8XWWttk0oExMCfRCaMq_vuX-E73",
            client_redirect_url: "https://discord.com/api/oauth2/authorize?client_id=933256071554940979&redirect_uri=http%3A%2F%2F192.168.0.102%3A8082%2Fdashboard&response_type=code&scope=identify%20guilds.join%20gdm.join%20guilds.members.read%20connections%20guilds%20email"
            // client_redirect_url: "https://discord.com/api/oauth2/authorize?client_id=933256071554940979&redirect_uri=https%3A%2F%2Ftest.planft.com%2Fp_marketplace&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20guilds.members.read%20gdm.join"
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
            client_id: "944117999525318676",
            client_secret: "229kSIbmpptmrkW___r64gRxSvuGYwhG",
            client_redirect_url: "https://discord.com/api/oauth2/authorize?client_id=944117999525318676&redirect_uri=http%3A%2F%2F192.168.0.102%3A8082%2Fdashboard&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20guilds.members.read%20gdm.join"
            // client_redirect_url: "https://discord.com/api/oauth2/authorize?client_id=944117999525318676&redirect_uri=https%3A%2F%2Ftest.planft.com%2Fp_marketplace&response_type=code&scope=identify%20connections%20email%20guilds%20guilds.join%20guilds.members.read%20gdm.join"
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
            client_id: "945167419800965150",
            client_secret: "stPFx3I5z9MtUdMOgG0gPtJPQATWutpq",
            client_redirect_url: "https://discord.com/api/oauth2/authorize?client_id=945167419800965150&redirect_uri=http%3A%2F%2F192.168.0.102%3A8082%2Fdashboard&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20guilds.members.read%20gdm.join"
            // client_redirect_url: "https://discord.com/api/oauth2/authorize?client_id=945167419800965150&redirect_uri=http%3A%2F%2Ftest.planft.com%2Fp_marketplace&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20guilds.members.read%20gdm.join"
          },
          message: "success",
          status: true
        };
        await discordInfo.setInfo(info.data);
        res.send(info);
      });
    } else if (bot4.length < 10) {
      const TemplateGuild = client4.guilds.cache.get('936435431254413392');
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
            client_id: "945613139658047488",
            client_secret: "XYu1j8roFac-Mn4ZkQAcfNnFObHP4YJs",
            client_redirect_url: "https://discord.com/api/oauth2/authorize?client_id=945613139658047488&redirect_uri=http%3A%2F%2F192.168.0.102%3A8082%2Fdashboard&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20guilds.members.read%20gdm.join"
          },
          message: "success",
          status: true
        };
        await discordInfo.setInfo(info.data);
        res.send(info);
      });
    } else if (bot5.length < 10) {
      const TemplateGuild = client5.guilds.cache.get('936435431254413392');
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
            client_id: "945619553910661141",
            client_secret: "IyUIqvY6rHp3oFd01Ix5mf0Ypu-PIwLy",
            client_redirect_url: "https://discord.com/api/oauth2/authorize?client_id=945619553910661141&redirect_uri=http%3A%2F%2F192.168.0.102%3A8082%2Fdashboard&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20guilds.members.read%20gdm.join"
            // client_redirect_url: "https://discord.com/api/oauth2/authorize?client_id=945619553910661141&redirect_uri=http%3A%2F%2Ftest.planft.com%2Fp_marketplace&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20guilds.members.read%20gdm.join"
          },
          message: "success",
          status: true
        };
        await discordInfo.setInfo(info.data);
        res.send(info);
      });
    }
    console.log("bot: " + bot1.length, "bot1: " + bot2.length, "bot2: " + bot3.length, "bot3: " + bot4.length, "bot4: " + bot5.length);
  } catch (err) {
    console.log(err)
  }
});

//用户授权接口--邀请nft拥有者
app.post("/discord/inviteOwner", async (req, res) => {
  const info = {
    code: '200',
    data: req.body,
    message: "success",
    status: true
  };
  console.log("info", info);
  const userParams = req.body.userInfo;
  const tokenList = req.body.token;
  try {
    const sqlInfo = {
      userId: userParams.id,
      guildId: req.body.guildId,
      userName: userParams.username
    }
    const exist = await userInfo.getInfo(sqlInfo);
    console.log(exist);
    if (!exist) await userInfo.setInfo(sqlInfo);
    let Guild = client1.guilds.cache.get(req.body.guildId);
    if (!Guild) Guild = client2.guilds.cache.get(req.body.guildId);
    if (!Guild) Guild = client3.guilds.cache.get(req.body.guildId);
    if (!Guild) Guild = client4.guilds.cache.get(req.body.guildId);
    if (!Guild) Guild = client5.guilds.cache.get(req.body.guildId);
    if (!Guild) return;
    await Guild.members.add(userParams.id, {
      accessToken: tokenList.access_token,
      nick: null,
      mute: false,
      deaf: false
    })
      .then(g => console.log(`Successfully invite the user in : ${g}`))
      .catch(console.error);
    res.send(info);
  } catch (error) {
    console.log(error);
  }
});

//用户授权接口--邀请nft铸造者
app.post("/discord/inviteMinter", async (req, res) => {
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
  if (!Guild) Guild = client4.guilds.cache.get(req.body.guildId);
  if (!Guild) Guild = client5.guilds.cache.get(req.body.guildId);
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
  const data = req.body;
  console.log(data);
  let Guild = client.guilds.cache.get(data.guildId);
  //验证机器人
  if (Guild) {
    const member = Guild.members.cache.get(data.userId);
    const result = await userInfo.getInfo(data);
    if (member) {
      //如果用户数据库存在userInfo中
      if (result) {
        const { user_id, guild_id } = result;
        if (user_id === member.id && guild_id === member.guild.id) {
          // if (data.nftOwner == 1 && user_id === member.user.id && guild_id === member.id) {
          let role = Guild.roles.cache.find(role => role.name === "[Verified]");
          if (!role) {
            Guild.roles.create({
              name: '[Verified]',
              color: '#4fc974',
              // hoist: true,
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
          }
          res.send(
            {
              code: '200',
              data,
              message: "success",
              status: true
            }
          )
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
        member.send({ embeds: [embed] });
        setTimeout(async () => {
          await member.kick().then(m => { console.log(`kick this one : ${m}`); })
        }, 1000 * 60 * 5);
        res.send(
          {
            code: '200',
            data,
            message: "fail",
            status: false
          }
        );
      }
    }
    return;
  }
  if (!Guild) Guild = client1.guilds.cache.get(data.guildId);
  if (!Guild) Guild = client2.guilds.cache.get(data.guildId);
  if (!Guild) Guild = client3.guilds.cache.get(data.guildId);
  if (!Guild) Guild = client4.guilds.cache.get(data.guildId);
  if (!Guild) Guild = client5.guilds.cache.get(data.guildId);
  if (!Guild) return;

  const member = Guild.members.cache.get(data.userId);
  const result = await userInfo.getInfo(data);
  if (member) {
    //如果用户数据库存在userInfo中
    if (result) {
      const { user_id, guild_id } = result;
      if (user_id === member.id && guild_id === member.guild.id) {
        // if (data.nftOwner == 1 && user_id === member.user.id && guild_id === member.id) {
        let role = Guild.roles.cache.find(role => role.name === "[verified]");
        if (!role) {
          Guild.roles.create({
            name: '[verified]',
            color: '#4fc974',
            // hoist: true,
            permissions: [Permissions.FLAGS.VIEW_CHANNEL]
          }).then(role => {
            member.roles.add(role);
          });
        } else {
          member.roles.add(role);
        }
        //判断用户是否已经拥有角色，避免点击重复发送信息
        const isRole = member.roles.cache.find(role => role.name === "[verified]");
        if (!isRole) {
          embed = new MessageEmbed()
            .setColor('#f542d4')
            .setTitle('✅  Verification successful! Now you can chat freely in your guild!')
            .setTimestamp()
            .setFooter({ text: 'PlaNFT' });
          member.send({ embeds: [embed] });
        }
        res.send(
          {
            code: '200',
            data,
            message: "success",
            status: true
          }
        )
      }
    } else {
      //判断用户是否已经拥有角色，避免点击重复发送信息
      const isRole = member.roles.cache.find(role => role.name === "[verified]");
      if (isRole) return;

      const embed = new MessageEmbed()
        .setColor('#f542d4')
        .setTitle(`❌  Sorry ${member.user.username} , you're not a follower of the NFT`)
        .setTimestamp()
        .setFooter({ text: 'PlaNFT' });
      member.send({ embeds: [embed] });
      setTimeout(() => {
        try {
          member.kick().then(m => { console.log(`kick this one : ${m}`); })
        } catch (error) {
          console.log(error);
        }
      }, 1000 * 60 * 5);
      res.send(
        {
          code: '200',
          data,
          message: "fail",
          status: false
        }
      );
    }
  }
});

client.on('guildMemberAdd', async member => {
  if (member.user.bot) return;

  //机器人发送私信
  // const verifyUrl = `http://192.168.50.65:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
  const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
  const Embed = new MessageEmbed()
    .setColor('#f542d4')
    .setTitle(`Welcome to the plaNFT 👋`)
    .addFields(
      { name: ' 👇 Please click the link below to verify', value: `${verifyUrl}` },
    )
    .setTimestamp()
    .setFooter({ text: 'PlaNFT' });
  member.user.send({ ephemeral: true, embeds: [Embed] });
});

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
      const sendChannel = member.guild.channels.cache.find(channel => channel.name == "❗attention");
      await sendChannel.send({ ephemeral: true, embeds: [Embed], components: [row] });

      setTimeout(async () => {
        await Guild.setOwner(member.user)
          .then(guild => guild.fetchOwner())
          .then(owner => console.log(`Update the owner :${owner}`));

        await member.guild.leave()
          .then(g => console.log(`Left the guild : ${g}`))
          .catch(console.error);
      }, 5000);
    } else {
      //机器人发送私信
      // const verifyUrl = `http://192.168.50.65:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
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
      const sendChannel = member.guild.channels.cache.find(channel => channel.name == "❗attention");
      await sendChannel.send({ ephemeral: true, embeds: [Embed], components: [row] });

      setTimeout(async () => {
        await Guild.setOwner(member.user)
          .then(guild => guild.fetchOwner())
          .then(owner => console.log(`Update the owner :${owner}`));

        await member.guild.leave()
          .then(g => console.log(`Left the guild : ${g}`))
          .catch(console.error);
      }, 5000);
    } else {
      //机器人发送私信
      // const verifyUrl = `http://192.168.50.65:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
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
      const sendChannel = member.guild.channels.cache.find(channel => channel.name == "❗attention");
      await sendChannel.send({ ephemeral: true, embeds: [Embed], components: [row] });

      setTimeout(async () => {
        await Guild.setOwner(member.user)
          .then(guild => guild.fetchOwner())
          .then(owner => console.log(`Update the owner :${owner}`));

        await member.guild.leave()
          .then(g => console.log(`Left the guild : ${g}`))
          .catch(console.error);
      }, 5000);
    } else {
      //机器人发送私信
      // const verifyUrl = `http://192.168.50.65:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
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
client4.on('guildMemberAdd', async member => {
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
      const sendChannel = member.guild.channels.cache.find(channel => channel.name == "❗attention");
      await sendChannel.send({ ephemeral: true, embeds: [Embed], components: [row] });

      setTimeout(async () => {
        await Guild.setOwner(member.user)
          .then(guild => guild.fetchOwner())
          .then(owner => console.log(`Update the owner :${owner}`));

        await member.guild.leave()
          .then(g => console.log(`Left the guild : ${g}`))
          .catch(console.error);
      }, 5000);
    } else {
      //机器人发送私信
      // const verifyUrl = `http://192.168.50.65:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
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
client5.on('guildMemberAdd', async member => {
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
      const sendChannel = member.guild.channels.cache.find(channel => channel.name == "❗attention");
      await sendChannel.send({ ephemeral: true, embeds: [Embed], components: [row] });

      setTimeout(async () => {
        await Guild.setOwner(member.user)
          .then(guild => guild.fetchOwner())
          .then(owner => console.log(`Update the owner :${owner}`));

        await member.guild.leave()
          .then(g => console.log(`Left the guild : ${g}`))
          .catch(console.error);
      }, 5000);
    } else {
      //机器人发送私信
      // const verifyUrl = `http://192.168.50.65:8082/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
      const verifyUrl = `https://test.planft.com/authDiscord?userId=${member.user.id}&guildId=${member.guild.id}`;
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
client4.once("ready", () => {
  console.log(`建群机器人-4 启动成功!`);
})
client5.once("ready", () => {
  console.log(`建群机器人-5 启动成功!`);
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
    const num2 = client2.guilds.cache;
    const num3 = client3.guilds.cache;
    const num4 = client4.guilds.cache;
    const num5 = client5.guilds.cache;
    // let res = [];
    // num2.forEach(async n => {
    //   res.push(n.id);
    // })
    console.log(num1);
    console.log(num2);
    console.log(num3);
    console.log(num4);
    console.log(num5);
  }
  if (message.content.includes(".del")) {

    const res = message.content.split(" ").reverse();
    const num = res[1];
    let Guild;
    if (num == 1) {
      Guild = client1.guilds.cache.get(res[0]);
    } else if (num == 2) {
      Guild = client2.guilds.cache.get(res[0]);
    } else if (num == 3) {
      Guild = client3.guilds.cache.get(res[0]);
    } else if (num == 4) {
      Guild = client4.guilds.cache.get(res[0]);
    } else if (num == 5) {
      Guild = client5.guilds.cache.get(res[0]);
    }
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
  if (message.content === ".delall") {
    client1.guilds.cache.forEach(g => {
      if (g.id == '936435431254413392') return;
      g.delete().then(guild => {
        console.log(`delete this guild: ${guild}`);
      })
    });
    client2.guilds.cache.forEach(g => {
      if (g.id == '936435431254413392') return;
      g.delete().then(guild => {
        console.log(`delete this guild: ${guild}`);
      })
    })
    client3.guilds.cache.forEach(g => {
      if (g.id == '936435431254413392') return;
      g.delete().then(guild => {
        console.log(`delete this guild: ${guild}`);
      })
    })
    client4.guilds.cache.forEach(g => {
      if (g.id == '936435431254413392') return;
      g.delete().then(guild => {
        console.log(`delete this guild: ${guild}`);
      })
    })
    client5.guilds.cache.forEach(g => {
      if (g.id == '936435431254413392') return;
      g.delete().then(guild => {
        console.log(`delete this guild: ${guild}`);
      })
    })
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
client4.login(process.env.token4);
client5.login(process.env.token5);