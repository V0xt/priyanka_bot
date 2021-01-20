const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class BitcoinAPI extends Command {
  constructor(client) {
    super(client, {
      name: 'bitcoin',
      description: 'Looks up current Bitcoin buy/sell price in USD from blockchain.info.',
      group: 'crypto',
      memberName: 'bitcoin',
      guildOnly: false,
      aliases: ['btc'],
      throttling: {
        usages: 2,
        duration: 10,
      },
    });
  }

  async run(message) {
    const result = await fetch('https://blockchain.info/ticker')
      .then((response) => response.json());

    message.say(`
      BUY: ${result.USD.buy}${result.USD.symbol}
      SELL: ${result.USD.sell}${result.USD.symbol}
    `.replace(/  +/g, ''));
  }
};
