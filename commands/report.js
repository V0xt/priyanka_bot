const fs = require('fs');

module.exports = {
	name: 'report',
	usage: '!report wishes/bugs',
	description: 'Sends your message to developers.',
	execute(message) {		
		let reportTime = message.createdAt;
		let reportGuild = message.guild;
		let reportSender = message.author;
		let reportMessage = message.content.slice(7);

		if (!reportMessage || reportMessage.length < 10 || reportMessage.length > 250) {
			return message.channel.send('Can\'t send empty/short or too long messages.');
		}

		fs.appendFile("./reports.txt", `Report information\nTime: ${reportTime}\nGuild: ${reportGuild}\nSender: ${reportSender} ${reportSender.username}\nMessage: ${reportMessage}\n======================================================\n`, function(err) {
			if (err) {
				return message.channel.send('Error: can\'t send message.');
			}
			console.log("The file was saved!");
			message.channel.send('Report successfully sent!');
		}); 		
	},
};