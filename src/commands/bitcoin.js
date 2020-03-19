const fetch = require('node-fetch');

module.exports = {
	name: 'bitcoin',
	description: 'Looks up current BitCoin buy/sell price in USD from blockchain.info.',
	guildOnly: false,
	aliases: ['bit', 'coin'],
	usage: '!bitcoin',
	cooldown: 5,

	async execute(message) {
		const result = await fetch('https://blockchain.info/ticker').then(response => response.json());
		message.channel.send(`BUY: ${result.USD.buy}${result.USD.symbol}\nSELL: ${result.USD.sell}${result.USD.symbol}`);
	},
};
