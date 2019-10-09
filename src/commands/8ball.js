module.exports = {
	name: '8ball',
	usage: '!8ball',
	aliases: '',
	description: `8-Ball reaches into the future, to find the answers to your questions. It knows what will be, and is willing to share this with you.\nJust think of a question that can be answered "Yes" or "No", concentrate very, very hard, and type \'!8ball\'. Then let 8-Ball show you the way!`,
	execute(message) {
		let answers = [
			'YES',
			'NO',
			'DEFINETLY NOT',
			'MAYBE',
			'WITHOUT A DOUBT',
			'OUTLOOK NOT SO GOOD',
			'YOU MAY RELY ON IT',
			'BETTER NOT TELL YOU NOW',
			'SIGNS POINT TO YES'
		]    
		let randomAnswer = Math.floor(Math.random() * Math.floor(answers.length));
		message.channel.send(answers[randomAnswer]);
	},
};