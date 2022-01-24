const express =require('express');
const app=express();

app.listen(3000,()=>{
    console.log("server is running!");
});

app.get('/',(req,res)=>{
    res.send('Hello world!');
});
app.post("/discord/test", (req, res) => {
  console.log(req.body);
});

const Discord=require("discord.js");
const client =new Discord.Client({intents:["GUILDS","GUILD_MESSAGES"]});

client.once('ready', () => {
	console.log('Rob listening at http://localhost:3000');
});
client.on("message",message=>{
    if(message.author.bot) return;
    if(message.content==='ping'){
        message.channel.send('pong');
    }
})
client.login('OTI4NDgzMDExMTExMDMwODQ1.YdZbMA.W0RuzIyfu7VVb-a1VVXGklXM-Pc');