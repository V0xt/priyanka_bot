const { Command } = require('discord.js-commando');
const web3 = require('web3');
const fetch = require('node-fetch');
const ethApi = process.env.ethApi;

module.exports = class EthereumAPI extends Command {
  constructor(client) {
    super(client, {
      name: 'eth',
      description: `
        Search for the current Ether price in USD and BTC
        or check the Ethereum wallet balance.
      `,
      group: 'crypto',
      memberName: 'eth',
      guildOnly: false,
      aliases: ['ethereum', 'ether'],
      examples: [
        '`!eth`',
        '`!eth 0x00De4B13153673BCAE2616b67bf822500d325Fc3 `',
      ],
      throttling: {
        usages: 2,
        duration: 10,
      },
      args: [
        {
          key: 'address',
          prompt: 'What address would you like me to check?',
          type: 'string',
          validate: address => web3.utils.isAddress(address),
          error: 'Invalid Ethereum address.',
          default: '',
        },
      ],
    });
  }

  async run(message, { address }) {
    const prices = await fetch(`
      https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ethApi}
    `)
      .then(response => response.json())
      .then(response => response.result);
    if(!address) {
      message.say(`
        Ether price in bitcoin on ${this.timestampToDate(prices.ethbtc_timestamp)}
        ${prices.ethbtc} BTC
        Ether price in USD on ${this.timestampToDate(prices.ethusd_timestamp)}
        ${prices.ethusd} USD
        You can use \`!eth [wallet_address]\` to check balance of ethereum wallet.
      `.replace(/  +/g, ''));
    } else {
      const balanceInWei = await fetch(`
        https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ethApi}
      `)
        .then(response => response.json())
        .then(response => response.result);

      const etherValue = web3.utils.fromWei(balanceInWei, 'ether');
      const usdValue = etherValue * prices.ethusd;
      message.say(`
        Address ${address}
        Balance: ${etherValue} Ether
        Ether value: $${usdValue.toFixed(2)} ($${prices.ethusd}/ETH)
      `.replace(/  +/g, ''));
    }
  }

  timestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toUTCString();
  }
};