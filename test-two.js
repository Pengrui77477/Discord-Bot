const express = require("express");
// const discordInfo = require('./service/db/discord_info');
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
// 接收创建服务器的请求
app.post("/discord/createChannel", (req, res) => {
    res.send("createChannel");
});



// 接收验证结果
app.post("/discord/discordAuth", async (req, res) => {
    res.send("createChannel");
    console.log(req.body);

    const Guild =client.guilds.cache.get(req.body.guildId);
    let member = await Guild.members.fetch(req.body.userId);
    if (req.body.nftOwner) {
        let role =Guild.roles.cache.find(role => role.name === "Owner");
        if (!role) {
            Guild.roles.create({
                name: 'Owner',
                color: '#00ffff',
                hoist: true,
                permissions: [Permissions.FLAGS.VIEW_CHANNEL]
            }).then(role => {
                member.roles.add(role);
            });
        } else {
            member.roles.add(role);
        }
        embed = new MessageEmbed()
            .setColor('#f542d4')
            .setTitle('✅  Verification successful! Now you can chat freely in your guild!')
            .setTimestamp()
            .setFooter({ text: 'PlaNFT' });
        member.send({ embeds: [embed] });
    } else {
        const embed = new MessageEmbed()
            .setColor('#f542d4')
            .setTitle(`❌  Sorry ${member.user.username} , you're not a follower of the NFT`)
            .setTimestamp()
            .setFooter({ text: 'PlaNFT' });
        member.send({ embeds: [embed] })
    }
});
app.listen(port, () =>
    console.log(`Rob listening at http://localhost:${port}`)
);


client.on('guildMemberAdd', async member => {
    if (member.user.bot) return;
    //机器人发送私信
    try {
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
        member.user.send({ ephemeral: true, embeds: [Embed] });
    } catch (err) {
        console.log(err)
    }
});

client.once("ready", () => {
    console.log(`Rob is ready!`);
});

client.login(process.env.token);
