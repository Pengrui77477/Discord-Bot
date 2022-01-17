module.exports = {
    name: "clear",
    description: "Delete a specified amount of messages",
    aliases: ["purge", "bulk", "bulkdelete", "delete", "remove"],
    usage: "<amount>",
    category: "Moderation",
    args: true,
    permission: "MANAGE_MESSAGES",
    execute(message, args) {
      message
        .delete()
        .then(() => {
          message.channel.bulkDelete(args[0]).then((messages) => {
            message.channel
              .send(`Cleared ${messages.size} message(s).`)
              .then((botMessage) => {
                setTimeout(function () {
                  botMessage.delete();
                }, 3000);
              });
          });
        })
        .catch(console.error);
    },
  };