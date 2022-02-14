const discordInfo = require('../service/db/discord_info');
module.exports = {
    name: "delete",
    description: "Delete the guild.",
    category: "Other",
    execute(message, args) {
      message.guild.delete()
      .then(g => {
        console.log(`Deleted the guild ${g}`);
        discordInfo.updateStatus(g);
      })
      .catch(console.error);
    },
  };