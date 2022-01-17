const { MessageEmbed } = require('discord.js');
module.exports = {
  name: "kick",
  description: "Kick the specified user for a specified reason.",
  usage: "<mention> [reason]",
  category: "Moderation",
  args: true,
  guildOnly: true,
  permission: "KICK_MEMBERS",
  execute(message, args) {
    const member = message.guild.members.cache.get(message.mentions.users.first().id);
    // console.log(message.mentions.users.first().id);
    
    if (member && !args[1]) {
      member.send("Sorry, we decided to kick you out");
      member
        .kick()
        .then(() => {
          const Embed = new MessageEmbed()
          .setTitle('Kick Member')
          .setDescription(`${member} was successfully kicked.`)
          .addField('Moderator', message.author.username, true)
          .addField('Member',member.user.tag, true)
          .addField('Reason', msgArgs)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
          message.channel.send({embeds:[Embed]});
        })
        .catch((err) => {
          message.channel.send(
            `❌ I was unable to kick the user ${member.user.tag}.`
          );
          console.log(err);
        });
    } else if (member && args[1]) {
      let msgArgs = args.slice(1).join(" ");
      member
        .kick(msgArgs)
        .then(() => {
          const Embed = new MessageEmbed()
          .setTitle('Kick Member')
          .setDescription(`${member} was successfully kicked.`)
          .addField('Moderator', message.author.username, true)
          .addField('Member',member.user.tag, true)
          .addField('Reason', msgArgs)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
          message.channel.send({embeds:[Embed]});
        })
        .catch((err) => {
          message.channel.send(
            `❌ I was unable to kick the user ${member.user.tag}.`
          );
          console.log(err);
        });
    } else {
      message.channel.send(`❌ 未找到将被执行的用户.`);
    }
  },
};
