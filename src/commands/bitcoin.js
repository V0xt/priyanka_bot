const { httpGetAsync } = require('./web/httpRequest');

module.exports = {
	name: 'bitcoin',
	usage: '!bitcoin',
	cooldown: 5,
	aliases: ['bit', 'coin'],
	description: 'Looks up current BitCoin buy/sell price in USD from blockchain.info.',
	async execute(message) {
		let url = 'https://blockchain.info/ticker';
		httpGetAsync(url, callback = (response) => {
			let result = JSON.parse(response);       
			message.channel.send(`BUY: ${result.USD.buy}${result.USD.symbol}\nSELL: ${result.USD.sell}${result.USD.symbol}`);
		});
	},
};
