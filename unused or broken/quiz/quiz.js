const { Command } = require('discord.js-commando');
const quiz = require('../../res/quiz.json');

module.exports = class About extends Command {
	constructor(client) {
		super(client, {
			name: 'quiz',
			description: 'Description.',
			group: 'utils',
			memberName: 'quiz',
			guildOnly: false,
			// aliases: [],
			usage: '!quiz',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}

	run(message) {
		const item = quiz[Math.floor(Math.random() * quiz.length)];
		const filter = response => {
			return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		message.channel.send(item.question).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
				.then(collected => {
					message.channel.send(`${collected.first().author} got the correct answer!`);
				})
				.catch(collected => {
					message.channel.send('Looks like nobody got the answer this time.');
				});
		});
	}
};
