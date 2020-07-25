const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new Youtube(process.env.youtubeAPI);

module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			description: 'Plays video or entire playlist from YouTube link.',
			group: 'music',
			memberName: 'play',
			guildOnly: true,
			clientPermissions: ['SPEAK', 'CONNECT'],
			aliases: ['p', 'play-song', 'add'],
			usage: '`!play [youtube_url]`',
			throttling: {
				usages: 2,
				duration: 10,
			},
			args: [
				{
					key: 'query',
					prompt: 'What video would you like to play to?',
					type: 'string',
					validate: query => query.length > 0 && query.length < 200,
				},
			],
		});
	}

	async run(message, { query }) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.say('Join a voice channel and try again');

		if (query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
			try {
				const playlist = await youtube.getPlaylist(query);
				const videosObj = await playlist.getVideos();
				message.say('Loading playlist');
				// iterate through the videos array and make a song object out of each vid
				for (let i = 0; i < videosObj.length; i += 1) {
					const video = await videosObj[i].fetch();
					const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
					const title = video.raw.snippet.title;
					let duration = this.formatDuration(video.duration);
					const thumbnail = video.thumbnails.high.url;
					if (duration == '00:00') duration = 'Live Stream';
					const song = {
						url,
						title,
						duration,
						thumbnail,
						voiceChannel,
					};
					message.guild.musicData.queue.push(song);
				}
				// if nothing is playing
				if (message.guild.musicData.isPlaying == false) {
					message.guild.musicData.isPlaying = true;
					// play the playlist
					return this.playSong(message.guild.musicData.queue, message);
				} else if (message.guild.musicData.isPlaying == true) {
					return message.say(
						`Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
					);
				}
			}	catch (err) {
				console.error(err);
				return message.say('Playlist is either private or it does not exist');
			}
		}

		if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
			// temp variable
			const url = query;
			try {
				query = query
					.replace(/(>|<)/gi, '')
					.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
				const id = query[2].split(/[^0-9a-z_\-]/i)[0]; // eslint-disable-line
				const video = await youtube.getVideoByID(id);
				const title = video.title;
				let duration = this.formatDuration(video.duration);
				const thumbnail = video.thumbnails.high.url;
				if (duration == '00:00') duration = 'Live Stream';
				const song = {
					url,
					title,
					duration,
					thumbnail,
					voiceChannel,
				};
				message.guild.musicData.queue.push(song);
				if (
					message.guild.musicData.isPlaying == false ||
					typeof message.guild.musicData.isPlaying == 'undefined'
				) {
					message.guild.musicData.isPlaying = true;
					return this.playSong(message.guild.musicData.queue, message);
				}	else if (message.guild.musicData.isPlaying == true) {
					return message.say(`${song.title} added to queue`);
				}
			}	catch (err) {
				console.error(err);
				return message.say('Something went wrong, please try again later');
			}
		}

		try {
			// search for the song and get 5 results back
			const videos = await youtube.searchVideos(query, 5);
			if (videos.length < 5) {
				return message.say(
					'I had some trouble finding what you were looking for, please try again or be more specific'
				);
			}
			const vidNameArr = [];
			// create an array that contains the result titles
			for (let i = 0; i < videos.length; i++) {
				vidNameArr.push(`${i + 1}: ${videos[i].title}`);
			}
			// push 'exit' string as it will be an option
			vidNameArr.push('exit');
			// create and display an embed which will present the user the 5 results
			// so he can choose his desired result
			const embed = new MessageEmbed()
				.setColor('#e9f931')
				.setTitle('Choose a song by commenting a number between 1 and 5')
				.addField('Song 1', vidNameArr[0])
				.addField('Song 2', vidNameArr[1])
				.addField('Song 3', vidNameArr[2])
				.addField('Song 4', vidNameArr[3])
				.addField('Song 5', vidNameArr[4])
				// user can reply with 'exit' if none matches
				.addField('Exit', 'exit');
			const songEmbed = await message.say({ embed });
			try {
				// wait 1 minute for the user's response
				const response = await message.channel.awaitMessages(
					msg => (msg.content > 0 && msg.content < 6) || msg.content === 'exit',
					{
						max: 1,
						maxProcessed: 1,
						time: 60000,
						errors: ['time'],
					},
				);
				// assign videoIndex to user's response
				const videoIndex = parseInt(response.first().content);
			}	catch (err) {
				console.error(err);
				songEmbed.delete();
				return message.say(
					'Please try again and enter a number between 1 and 5 or exit'
				);
			}
			// if the user responded with 'exit', cancel the command
			if (response.first().content === 'exit') return songEmbed.delete();
			try {
				// get video data from the API
				const video = await youtube.getVideoByID(videos[videoIndex - 1].id);
			} catch (err) {
				console.error(err);
				songEmbed.delete();
				return message.say(
					'An error has occured when trying to get the video ID from youtube',
				);
			}
			const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
			const title = video.title;
			let duration = this.formatDuration(video.duration);
			const thumbnail = video.thumbnails.high.url;
			if (duration == '00:00') duration = 'Live Stream';
			const song = {
				url,
				title,
				duration,
				thumbnail,
				voiceChannel,
			};

			message.guild.musicData.queue.push(song);

			if (message.guild.musicData.isPlaying == false) {
				message.guild.musicData.isPlaying = true;
				// delete the selection embed
				songEmbed.delete();
				this.playSong(message.guild.musicData.queue, message);
			}	else if (message.guild.musicData.isPlaying == true) {
				songEmbed.delete();
				// add the song to queue if one is already playing
				return message.say(`${song.title} added to queue`);
			}
		} catch (err) {
			// if something went wrong when calling the api:
			console.error(err);
			if (songEmbed) {
				songEmbed.delete();
			}
			return message.say('Something went wrong with searching the video you requested :(');
		}
	}

	playSong(queue, message) {
		let voiceChannel;
		queue[0].voiceChannel
			// join the user's voice channel
			.join()
			.then(connection => {
				const dispatcher = connection
					.play(
						// pass the url to .ytdl()
						ytdl(queue[0].url, {
							quality: 'highestaudio',
						}),
					)
					.on('start', () => {
						// the following line is essential to other commands like skip
						message.guild.musicData.songDispatcher = dispatcher;
						dispatcher.setVolume(message.guild.musicData.volume);
						voiceChannel = queue[0].voiceChannel;
						// display the current playing song as a nice little embed
						const videoEmbed = new MessageEmbed()
						// song thumbnail
							.setThumbnail(queue[0].thumbnail)
							.setColor('#e9f931')
							.addField('Now Playing:', queue[0].title)
							.addField('Duration:', queue[0].duration);
						// also display next song title, if there is one in queue
						if (queue[1]) videoEmbed.addField('Next Song:', queue[1].title);
						// send the embed to chat
						message.say(videoEmbed);
						message.guild.musicData.nowPlaying = queue[0];
						// dequeue the song
						return queue.shift();
					})
					// this event fires when the song has ended
					.on('finish', () => {
						// if there are more songs in queue
						if (queue.length >= 1) {
							// continue playing
							return this.playSong(queue, message);
							// else if there are no more songs in queue
						} else {
							message.guild.musicData.isPlaying = false;
							message.guild.musicData.nowPlaying = null;
							message.guild.musicData.songDispatcher = null;
							return voiceChannel.leave();
						}
					})
					.on('error', e => {
						message.say('Cannot play song');
						message.guild.musicData.queue.length = 0;
						message.guild.musicData.isPlaying = false;
						message.guild.musicData.nowPlaying = null;
						console.error(e);
						return voiceChannel.leave();
					});
			})
			.catch(e => {
				console.error(e);
				return voiceChannel.leave();
			});
	}

	formatDuration(durationObj) {
		const duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${
			durationObj.minutes ? durationObj.minutes : '00'
		}:${
			durationObj.seconds < 10 ? '0' + durationObj.seconds
				: durationObj.seconds	? durationObj.seconds
					: '00'
		}`;
		return duration;
	}
};