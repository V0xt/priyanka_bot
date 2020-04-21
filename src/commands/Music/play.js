const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'play',
	description: 'Play a song in your channel!',
	guildOnly: true,
	// aliases: [],
	usage: '`!play [youtube_url]`',
	cooldown: 5,

	async execute(message, args) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			return message.channel.send('You need to be in a voice channel to play music!');
		}

		if (!args.length || !this.isUrl(args[0]) || args[0].slice(0, 29) != 'https://www.youtube.com/watch') {
			return message.channel.send(
				'You must provide a correct link to the song! Example:\n`!play https://www.youtube.com/watch?v=dQw4w9WgXcQ`');
		}

		const queue = message.client.queue;
		const serverQueue = message.client.queue.get(message.guild.id);

		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need the permissions to join and speak in your voice channel!');
		}

		const songInfo = await ytdl.getInfo(args[0]);
		const song = {
			title: songInfo.title,
			url: songInfo.video_url,
			duration: (songInfo.length_seconds / 60).toFixed(2),
		};

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 3,
				playing: true,
			};

			queue.set(message.guild.id, queueContruct);

			queueContruct.songs.push(song);

			try {
				const connection = await voiceChannel.join();
				queueContruct.connection = connection;
				this.play(message, queueContruct.songs[0]);
			}
			catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		}
		else {
			serverQueue.songs.push(song);
			return message.channel.send(`${song.title} has been added to the queue by <@${message.author.id}>!`);
		}
	},

	isUrl(s) {
		const regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return regexp.test(s);
	},

	play(message, song) {
		const queue = message.client.queue;
		const guild = message.guild;
		const serverQueue = queue.get(message.guild.id);

		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}

		const dispatcher = serverQueue.connection.play(ytdl(song.url, {
			quality: 'highestaudio',
			highWaterMark: 1024 * 1024 * 10,
		}))
			.on('start', () => {
				dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
				// message.channel.send(`Now playing: ${serverQueue.songs[0].title} by <@${message.author.id}>`);
				console.log(serverQueue.songs[0]);
				const videoEmbed = new MessageEmbed()
					.setColor('#e9f931')
					.addField('Now Playing:', serverQueue.songs[0].title)
					.addField('Duration:', serverQueue.songs[0].duration);
				if (serverQueue.songs[1]) videoEmbed.addField('Next Song:', serverQueue.songs[1].title);
				message.channel.send(videoEmbed);
			})
			.on('finish', () => {
				console.log('Music ended!');
				serverQueue.songs.shift();
				this.play(message, serverQueue.songs[0]);
			})
			.on('error', error => {
				console.error(error);
			});
	},
};