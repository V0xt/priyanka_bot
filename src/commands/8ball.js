module.exports = {
	name: '8ball',
	usage: '!8ball',
	description: 'Returns random answer.',
	execute(message) {
		let answers = [
			'yes',
			'no',
			'definetly not',
			'maybe'
		]    
		let randomAnswer = Math.floor(Math.random() * Math.floor(answers.length));
		message.channel.send('I think `' + answers[randomAnswer] + '.`');
	},
};