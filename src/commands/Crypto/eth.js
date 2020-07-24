const { Command } = require('discord.js-commando');
const ethApi = process.env.ethApi;
const fetch = require('node-fetch');

module.exports = class EthereumAPI extends Command {
	constructor(client) {
		super(client, {
			name: 'eth',
			description: 'Looks up current Ether price in USD and bitcoin.',
			group: 'crypto',
			memberName: 'eth',
			guildOnly: false,
			aliases: ['ethereum', 'ether'],
			usage: `\`!eth\` or \`!eth [account address]\``,
			throttling: {
				usages: 2,
				duration: 10,
			},
			args: [
				{
					key: 'address',
					prompt: 'What address would you like me to check?',
					type: 'string',
					default: '',
				},
			],
		});
	}

	async run(message, { address }) {
		let response = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ethApi}`).then(response => response.json());
		const result = response.result;
		if(!address.length) {
			message.say(`Ether price in bitcoin on ${this.timestampToDate(result.ethbtc_timestamp)}\n${result.ethbtc} BTC\nEther price in USD on ${this.timestampToDate(result.ethbtc_timestamp)}\n${result.ethusd} USD`);
			return message.say('You can send \`!eth [account address]\` to get balance of a specific ethereum address');
		}
		response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ethApi}`).then(response => response.json());
		if(response.status === '0') {
			return message.say('Invalid address format.');
		}
		const ether = response.result / Math.pow(10, 18);
		const usd = ether * result.ethusd;
		message.say(`Address ${address}\nBalance:  ${ether} Ether\nEther value:  $${usd.toFixed(2)} ($${result.ethusd}/ETH)`);
	}

	timestampToDate(timestamp) {
		const date = new Date(timestamp * 1000);
		return date.toUTCString();
	}
};