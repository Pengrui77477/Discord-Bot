const discordInfo = require('../service/db/discord_info');
module.exports = {
    name: "delete",
    description: "Delete the guild.",
    category: "Other",
    execute(message, args) {
      message.guild.delete()
      .then(g => {
        console.log(`Deleted the guild ${g}`);
        discordInfo.updateInfo(g);
      })
      .catch(console.error);
    },
  };