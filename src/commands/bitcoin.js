const { httpGetAsync } = require('./web/httpRequest');

module.exports = {
	name: 'bitcoin',
	description: 'Looks up current BitCoin buy/sell price in USD from blockchain.info.',
	aliases: ['bit', 'coin'],
	usage: '!bitcoin',
	cooldown: 5,	

	async execute(message) {
		let url = 'https://blockchain.info/ticker';
		httpGetAsync(url, callback = (response) => {
			let result = JSON.parse(response);       
			message.channel.send(`BUY: ${result.USD.buy}${result.USD.symbol}\nSELL: ${result.USD.sell}${result.USD.symbol}`);
		});
	},
};
