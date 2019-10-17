const quiz = require('../res/quiz.json');

module.exports = {
	name: 'quiz',
	description: 'Description.',
	guildOnly: false,
	// aliases: [],
	usage: '!quiz',	
	cooldown: 10,	
	
	execute(message) {
		let item = quiz[Math.floor(Math.random() * quiz.length)];
		let filter = response => {
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
}
