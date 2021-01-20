const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const catApi = process.env.catApi;

module.exports = class Cat extends Command {
  constructor(client) {
    super(client, {
      name: 'cat',
      description: 'Sends random cat picture.',
      group: 'other',
      memberName: 'cat',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 10,
      },
    });
  }

  async run(message) {
    const result = await fetch(`https://api.thecatapi.com/v1/images/search?api=${catApi}&size=small`)
      .then(response => response.json());
    message.say(result[0].url);
  }
};
