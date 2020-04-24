module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	guildOnly: false,
	aliases: ['icon', 'pfp'],
	usage: '!avatar @username1[,@username2,...]',
	cooldown: 5,

	execute(message) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL()}>`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL()}>`;
		});

		message.channel.send(avatarList);
	},
};