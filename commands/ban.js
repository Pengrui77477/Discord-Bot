module.exports = {
    name: "ban",
    category: "Moderation",
    description:
      "Ban a member of the current server.\nSet `<days>` to 0 for perm-ban.",
    aliases: ["banish"],
    usage: "<mention> <days> [reason]",
    args: true,
    guildOnly: true,
    permission: "BAN_MEMBERS",
    execute(message, args) {
      const member = message.guild.members.cache.get(message.mentions.users.first().id);
      if (!member)
        return message.channel.send(
          "I couldn't find the user you requested in this server!"
        );
  
      if (!args[1])
        return message.channel.send(
          `Please specify how long you'd like to ban ${member.user.tag} for.`
        );
  
      const matches = args[1].match(/(\d+)/);
      if (!matches)
        return message.channel.send(
          `Please use a number to specify how long you'd like to ban ${member.user.tag} for.`
        );
  
      let days;
      if (matches[0] == 0) {
        days = `ever`;
      } else {
        days = ` ${matches[0]} day(s)`;
      }
  
      if (!args[2])
        return member
          .ban({ days: matches[0] })
          .then(() => {
            message.reply(`✅ Successfully banned ${member.user.tag} for${days}.`);
          })
          .catch(() => {
            message.channel.send(
              `❌ I was unable to ban the user ${member.user.tag}.`
            );
            console.error();
          });
  
      let msgArgs = args.slice(2).join(" ");
      member
        .ban({ days: matches[0], reason: msgArgs })
        .then(() => {
          message.reply(
            `✅ Successfully banned ${member.user.tag} for "${msgArgs}" for${days}.`
          );
        })
        .catch(() => {
          message.channel.send(
            `❌ I was unable to ban the user ${member.user.tag}.`
          );
          console.error();
        });
    },
  };
  