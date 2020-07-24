const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class BitcoinAPI extends Command {
	constructor(client) {
		super(client, {
			name: 'bitcoin',
			description: 'Looks up current BitCoin buy/sell price in USD from blockchain.info.',
			group: 'crypto',
			memberName: 'bitcoin',
			guildOnly: false,
			aliases: ['bit', 'coin', 'btc'],
			usage: '!bitcoin',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	async run(message) {
		const result = await fetch('https://blockchain.info/ticker').then(response => response.json());
		message.say(`BUY: ${result.USD.buy}${result.USD.symbol}\nSELL: ${result.USD.sell}${result.USD.symbol}`);
	}
};
