module.exports = {
    name: "warn",
    description: "Warn a member.",
    permission: "KICK_MEMBERS",
    usage: "<member> [reason]",
    category: "Moderation",
    args: true,
    guildOnly: true,
    execute(message, args, db) {
      // if (!message.mentions.users.first())
      //   return message.channel.send("Please mention a member.");
      // const member = message.mentions.users.first();
      const member = message.mentions.users.first();
      console.log(member);
      let warnings;
      let exceeded = false;
      db.collection("guilds")
        .doc(message.guild.id)
        .collection("members")
        .doc(member.id)
        .get()
        .then((q) => {
          if (q.exists) {
            warnings = q.data().warnings;
            db.collection("guilds")
              .doc(message.guild.id)
              .collection("members")
              .doc(member.id)
              .update({
                warnings: warnings + 1,
              });
            if (warnings + 1 >= 5) {
              exceeded = true;
              db.collection("guilds")
                .doc(message.guild.id)
                .collection("members")
                .doc(member.id)
                .update({
                  warnings: 0,
                });
            }
          } else {
            warnings = 0;
            db.collection("guilds")
              .doc(message.guild.id)
              .collection("members")
              .doc(member.id)
              .set({
                warnings: 1,
              });
          }
        })
        .then(() => {
          let reason = "";
          if (args[1]) {
            reason = ` for "${args.slice(1).join(" ")}"`;
          }
          if (exceeded == true) {
            try {
              member.send(
                `${member}, You have exceeded your warn limit and have been kicked by ${message.author} in the server "${message.guild.name}"${reason}.`
              );
              message.guild
                .member(member)
                .kick()
                .then(() => {
                  message.channel.send(
                    `${member.tag} has exceeded their warn limit and has been kicked from the server${reason}.`
                  );
                });
            } catch (e) {
              message.channel.send(
                `${member.tag} has exceeded their warn limit, however I failed to kick them. Their role may be higher than me.`
              );
            }
          } else {
            member.send(
              `${member}, You have been warned by ${
                message.author
              } in the server "${message.guild.name}"${reason}. You have ${
                5 - (warnings + 1)
              } warning(s) left.`
            );
            message.channel.send(
              `${member.tag} has been warned${reason}. They have ${
                5 - (warnings + 1)
              } warning(s) left.`
            );
          }
        });
    },
  };
  