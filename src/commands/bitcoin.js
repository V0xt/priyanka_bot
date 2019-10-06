const { httpGetAsync } = require('./web/httpRequest');

module.exports = {
	name: 'bitcoin',
	usage: '!bitcoin',
	description: 'Looks up current BitCoin buy/sell price in USD.',
	async execute(message) {
		let url = 'https://blockchain.info/ticker';
		httpGetAsync(url, callback = (response) => {
			let result = JSON.parse(response);
			console.log(result.USD);        
			message.channel.send(`BUY: ${result.USD.buy}${result.USD.symbol}\nSELL: ${result.USD.sell}${result.USD.symbol}`);
		});
	},
};
