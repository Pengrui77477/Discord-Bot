const { MessageEmbed } = require("discord.js");
const globalFunctions = require("../globalFunctions");
module.exports = {
  name: "joke",
  description: "get joke.",
  // usage: "<user>",
  category: "Other",
  // args: true,
  execute(message, args) {
    async function AsyncFunc(message) {
      console.log(args[0]);
      message.channel.send(await globalFunctions.data.getJoke());
    }
    AsyncFunc(message);
  },
};