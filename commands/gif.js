const globalFunctions = require("../service/methods/globalFunctions");
module.exports = {
  name: "gif",
  description: "Find the GIF you want.",
  // usage: "<user>",
  category: "GIF",
  args: true,
  execute(message, args) {
    async function AsyncFunc(message) {
      console.log(args[0]);
      message.channel.send(await globalFunctions.data.getGif(`${args[0]}`, 25));
    }
    AsyncFunc(message);
  },
};