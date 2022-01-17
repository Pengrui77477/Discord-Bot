module.exports = {
    name: "summon",
    description: "Invite the specified user to the channel you are currently in.",
    // aliases: ["invite"],
    usage: "<tag/mention>",
    category: "Fun",
    args: true,
    guildOnly: true,
    execute(message, args) {
      let targetUser;
      let targetTag = args.slice(0).join(" ");
      if (message.mentions.users.first()) {
        targetUser = message.mentions.users.first();
      } else {
        targetUser = message.client.users.cache.find(
          (user) => user.tag == targetTag
        );
      }
      console.log(targetUser);
      if (!targetUser) {
        if(message.author.bot) return;
          message.reply("I couldn't find the user you requested.");
      } else {
        async function createInvite(message) {
          // console.log(message.channel);
          let invite = await message.channel
            .createInvite(
              {
                maxAge: 0,
                maxUses: 1,
              },
              `Requested with "summon" command by ${message.author.tag}.`
            )
            .catch(() => {
              console.log;
              message.reply(
                "There was an error creating the invite, please try again later."
              );
            });
            console.log(invite);
          targetUser
            .send(
              `${targetUser}, ${message.author} has summoned you! To accept, click on the following invite!${invite}`
            )
            .then(() => {
              message.channel.send("✅ Summon request successfully sent!");
            })
            .catch(() =>
              message.channel.send(
                "There was an error sending a message to the requested user. They may have their DMs disabled!"
              )
            );
        }
        createInvite(message);
      }
    },
  };
  