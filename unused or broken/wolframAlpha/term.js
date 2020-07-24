// const { Command } = require('discord.js-commando');
// const fetch = require('node-fetch');
// const waApi = process.env.waApi;

// module.exports = class About extends Command {
// 	constructor(client) {
// 		super(client, {
// 			name: 'term',
// 			description: '.',
// 			group: 'wolfram',
// 			memberName: 'term',
// 			guildOnly: false,
// 			// aliases: [ ],
// 			usage: '!term',
// 			throttling: {
// 				usages: 2,
// 				duration: 10,
// 			},
// 		});
// 	}

// 	async run(message, args) {
// 		if (!args.length) {
// 			return message.channel.send('Please, provide correct arguments');
// 		}

// 		const result = await fetch(`http://api.wolframalpha.com/v2/query?input=${args}&appid=${waApi}`)
// 			.then(response => response.text())
// 			.then(xmlString => parseFromString(xmlString, 'text/xml'))
//     	.then(data => console.log(data))

// 		// console.log(result);
// 		message.channel.send(`${result}`);
// 	}
// };