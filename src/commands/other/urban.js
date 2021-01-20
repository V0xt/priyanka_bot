const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = class UrbanDictionary extends Command {
  constructor(client) {
    super(client, {
      name: 'urban',
      description: 'Get the definition for a specified term from urbandictionary.com',
      group: 'other',
      memberName: 'urban',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 10,
      },
      args: [
        {
          key: 'term',
          prompt: 'What term would you like me to check?',
          type: 'string',
        },
      ],
    });
  }

  async run(message, { term }) {
    const query = querystring.stringify({ term });

    const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
      .then((response) => response.json());

    if (!list.length) {
      message.say(`No results found for **${term}**.`);
      return;
    }

    const [answer] = list;

    const embed = new Discord.MessageEmbed()
      .setColor('#EFFF00')
      .setTitle(answer.word)
      .setURL(answer.permalink)
      .addField('Definition', trim(answer.definition, 1024))
      .addField('Example', trim(answer.example, 1024))
      .addField('Rating', `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`);

    message.say(embed);
  }
};
