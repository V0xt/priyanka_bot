module.exports = {
	name: 'userinfo',
	usage: '!userinfo',
	description: 'Get information about a user.',
	execute(message) {
		const member = message.mentions.members.first();
		const user = member.user;
		message.channel.send(`Name: ${user.username}, ID: ${user.id}`);
	},
};