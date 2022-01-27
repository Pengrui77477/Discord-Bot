const fetch = require('node-fetch');
require('dotenv').config()
console.log(process.env.GIPHY_KEY);
const globalFunctions = {
  getGif: async function (query, limit, variable) {
        const giphy = await fetch(
            `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${process.env.GIPHY_KEY}&limit=${limit}`
        ).then((response) => response.json())
            .catch((err) => {
                console.log(err);
            })

        const result = giphy.data[Math.floor(Math.random() * Math.floor(giphy.data.length))].images.original.url;
        
        return result;
    },
  getImage: function (message, query, random) {
    const request = require("request");
    const cheerio = require("cheerio");
    var options = {
      url: `https://results.dogpile.com/serp?qc=images&q=${query}`,
      method: "GET",
      headers: {
        Accept: "text/html",
        "User-Agent": "Chrome",
      },
    };

    request(options, function (error, response, responseBody) {
      if (error) {
        return;
      }
      $ = cheerio.load(responseBody);
      var links = $(".image a.link");
      var urls = new Array(links.length)
        .fill(0)
        .map((v, i) => links.eq(i).attr("href"));
      if (!urls.length) {
        return;
      }
      let index = 1;
      if (random) {
        index = Math.floor(Math.random() * urls.length);
      }
      message.channel.send(urls[index]);
    });
  },
  getJoke: async function(){
    const result=await fetch("https://api.oick.cn/dutang/api.php").then((response) => response.json()).catch((err)=>{
      console.log(err);
    })
    return result;
  }
};
exports.data = globalFunctions;
