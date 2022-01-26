const Discord = require("discord.js");
const {MessageEmbed}=require("discord.js");
module.exports = {
    name: "sendbutton",
    description: "create an button.",
    // permission: "MANAGE_CHANNELS",
    category: "button",
    execute(message, args) {
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId(`deletable`)
                    .setLabel('Verification completed')
                    .setStyle('PRIMARY')
            );
        try {
            //({ ephemeral: true, embeds: [Embed]});
            message.channel.send({content:'Please click the Verification button after clicking the link our robot sent to you',ephemeral: true, components: [row] });
        } catch (err) {
            console.log(err)
        }
    },
};
