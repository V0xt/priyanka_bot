const magicBall = require('../res/8ball.json');

module.exports = {
	name: '8ball',
	usage: '!8ball',
	aliases: '',
	cooldown: 5,
	description: `8-Ball reaches into the future, to find the answers to your questions. It knows what will be, and is willing to share this with you.\nJust think of a question that can be answered "Yes" or "No", concentrate very, very hard, and type \'!8ball\'. Then let 8-Ball show you the way!`,
	execute(message) {
		let randomAnswer = magicBall.answers[Math.floor(Math.random() * magicBall.answers.length)];
		message.channel.send(randomAnswer);
	},
};