const { Permissions, GuildChannel } = require('discord.js')
module.exports = {
  name: "invite",
  description: "Create threads.",
  // usage: "<tag/mention>",
  category: "Fun",
  // args: true,
  guildOnly: true,
  execute(message, args) {
    async function createChannel(message) {
      try {
        // const thread = message.channel.threads.create({
        // name: 'food-talk',
        // autoArchiveDuration: 60,
        // reason: 'Needed a separate thread for food',
        // });
        // console.log(`Created thread: ${thread.name}`);
        const a = Math.random() * 1000;
        await message.guild.channels.create(`test-channel-${a.toFixed()}`, {
          type: 'GUILD_TEXT',
          // permissionOverwrites: [
          //   {
          //     id: message.guild.id,
          //     // deny: [Permissions.FLAGS.VIEW_CHANNEL],
          //   },
          //   // {
          //   //   id: message.author.id,
          //   //   allow: [Permissions.FLAGS.VIEW_CHANNEL],
          //   // }
          // ],
        })
          .then(async (channel) => {
            const categoryId = '931098760296153100';
            channel.setParent(categoryId);
            console.log(channel);
            try {
              let invite = await channel.createInvite({
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
              // console.log(invite);
              message.channel.send(` To accept, click on the following invite! ${invite}`);
            } catch (err) {
              console.log(err);
            }
          })
      } catch (err) {
        console.log(err);
      }
    }
    createChannel(message);
  },
};



