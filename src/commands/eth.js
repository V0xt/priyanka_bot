const fetch = require('node-fetch');
const { ethApi } = require('../../config.json');

module.exports = {
	name: 'eth',
	description: 'Looks up current Ether price in USD and bitcoin.',
	guildOnly: false,
	aliases: ['ethereum', 'ether'],
	usage: `\`!eth\` or \`!eth [account address]\``,
	cooldown: 2,	

	async execute(message, args) {
		let response  = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ethApi}`).then(response => response.json());
		const result = response.result;
		if(!args.length){
			message.channel.send(`Ether price in bitcoin on ${this.timestampToDate(result.ethbtc_timestamp)}\n${result.ethbtc} BTC\nEther price in USD on ${this.timestampToDate(result.ethbtc_timestamp)}\n${result.ethusd} USD`);
			return message.channel.send(`You can send \`!eth [account address]\` to get balance of a specific ethereum address!`);
		}			
		response  = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${args}&tag=latest&apikey=${ethApi}`).then(response => response.json());
		if(response.status === '0') {
			return message.channel.send('Error! Invalid address format.');
		}
		const ether = response.result / Math.pow(10, 18);
		const usd = ether * result.ethusd;
		message.channel.send(`Address ${args}\nBalance:  ${ether} Ether\nEther value:  $${usd.toFixed(2)} ($${result.ethusd}/ETH)`);
	},
	timestampToDate(timestamp) {
		let date = new Date(timestamp * 1000);
		return date.toUTCString();
	},
};