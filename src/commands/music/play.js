/* eslint-disable no-param-reassign */
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
      examples: [
        '`!play https://www.youtube.com/watch?v=y6120QOlsfU`',
        '`!play darude sandstorm`',
      ],
      throttling: {
        usages: 2,
        duration: 10,
      },
      args: [
        {
          key: 'query',
          prompt: 'What video would you like to play to?',
          type: 'string',
          validate: (query) => query.length > 0 && query.length < 200,
        },
      ],
    });
  }

  async run(message, { query }) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.say('Join a voice channel and try again');
      return;
    }

    if (query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
      try {
        const playlist = await youtube.getPlaylist(query);
        const videosObj = await playlist.getVideos();
        message.say('Loading playlist');
        for (let i = 0; i < videosObj.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          const video = await videosObj[i].fetch();
          const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
          const { title } = video.raw.snippet;
          let duration = this.formatDuration(video.duration);
          const thumbnail = video.thumbnails.high.url;
          if (duration === '00:00') duration = 'Live Stream';
          const song = {
            url,
            title,
            duration,
            thumbnail,
            voiceChannel,
          };
          message.guild.musicData.queue.push(song);
        }
        if (message.guild.musicData.isPlaying) {
          message.say(`
            Playlist - :musical_note:  ${playlist.title}
            :musical_note: has been added to queue
          `);
          return;
        }
        message.guild.musicData.isPlaying = true;
        this.playSong(message.guild.musicData.queue, message);
        return;
      } catch (err) {
        console.error(err);
        message.say('Playlist is either private or it does not exist.');
        return;
      }
    }

    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
      const url = query;
      try {
        query = query
          .replace(/(>|<)/gi, '')
          .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        const id = query[2].split(/[^0-9a-z_-]/i)[0];
        const video = await youtube.getVideoByID(id);
        const { title } = video;
        let duration = this.formatDuration(video.duration);
        const thumbnail = video.thumbnails.high.url;
        if (duration === '00:00') duration = 'Live Stream';
        const song = {
          url,
          title,
          duration,
          thumbnail,
          voiceChannel,
        };
        message.guild.musicData.queue.push(song);
        if (message.guild.musicData.isPlaying) {
          message.say(`${song.title} added to queue`);
          return;
        }
        message.guild.musicData.isPlaying = true;
        this.playSong(message.guild.musicData.queue, message);
        return;
      } catch (err) {
        console.error(err);
        message.say('Something went wrong, please try again later');
        return;
      }
    }

    const videos = await youtube.searchVideos(query, 5).catch(async () => {
      await message.say(
        'There was a problem searching the video you requested :(',
      );
    });
    if (videos.length < 5 || !videos) {
      message.say('I had some trouble finding what you were looking for, please try again or be more specific.');
      return;
    }
    const vidNameArr = [];
    for (let i = 0; i < videos.length; i += 1) {
      vidNameArr.push(`${i + 1}: ${videos[i].title}`);
    }
    vidNameArr.push('exit');
    const embed = new MessageEmbed()
      .setColor('#e9f931')
      .setTitle('Choose a song by commenting a number between 1 and 5')
      .addField('Song 1', vidNameArr[0])
      .addField('Song 2', vidNameArr[1])
      .addField('Song 3', vidNameArr[2])
      .addField('Song 4', vidNameArr[3])
      .addField('Song 5', vidNameArr[4])
      .addField('Exit', 'exit');
    const songEmbed = await message.channel.send({ embed });
    message.channel
      .awaitMessages(
        (msg) => (msg.content > 0 && msg.content < 6) || msg.content === 'exit',
        {
          max: 1,
          time: 60000,
          errors: ['time'],
        },
      )
      .then((response) => {
        const videoIndex = parseInt(response.first().content, 10);
        if (response.first().content === 'exit') {
          songEmbed.delete();
          return;
        }
        youtube
          .getVideoByID(videos[videoIndex - 1].id)
          .then((video) => {
            const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
            const { title } = video;
            let duration = this.formatDuration(video.duration);
            const thumbnail = video.thumbnails.high.url;
            if (duration === '00:00') duration = 'Live Stream';
            const song = {
              url,
              title,
              duration,
              thumbnail,
              voiceChannel,
            };
            message.guild.musicData.queue.push(song);
            if (message.guild.musicData.isPlaying === false) {
              message.guild.musicData.isPlaying = true;
              if (songEmbed) {
                songEmbed.delete();
              }
              this.playSong(message.guild.musicData.queue, message);
            } else if (message.guild.musicData.isPlaying === true) {
              if (songEmbed) {
                songEmbed.delete();
              }
              message.say(`${video.title} added to queue`);
            }
          })
          .catch((err) => {
            console.log(err);
            if (songEmbed) {
              songEmbed.delete();
            }
            return message.say(
              'An error has occured when trying to get the video ID from youtube',
            );
          });
      })
      .catch(() => {
        if (songEmbed) {
          songEmbed.delete();
        }
        return message.say(
          'Please try again and enter a number between 1 and 5 or exit',
        );
      });
  }

  playSong(queue, message) {
    let voiceChannel;
    queue[0].voiceChannel.join().then((connection) => {
      const dispatcher = connection
        .play(
          ytdl(queue[0].url, {
            quality: 'highestaudio',
          }),
        )
        .on('start', () => {
          message.guild.musicData.songDispatcher = dispatcher;
          dispatcher.setVolume(message.guild.musicData.volume);
          voiceChannel = queue[0].voiceChannel;

          const videoEmbed = new MessageEmbed()
            .setThumbnail(queue[0].thumbnail)
            .setColor('#e9f931')
            .addField('Now Playing:', queue[0].title)
            .addField('Duration:', queue[0].duration);

          if (queue[1]) videoEmbed.addField('Next Song:', queue[1].title);

          message.say(videoEmbed);
          const [song] = queue[0];
          message.guild.musicData.nowPlaying = song;

          return queue.shift();
        })
        .on('finish', () => {
          if (queue.length >= 1) {
            return this.playSong(queue, message);
          }
          message.guild.musicData.isPlaying = false;
          message.guild.musicData.nowPlaying = null;
          message.guild.musicData.songDispatcher = null;
          return voiceChannel.leave();
        })
        .on('error', (e) => {
          message.say('Cannot play song');
          message.guild.musicData.queue.length = 0;
          message.guild.musicData.isPlaying = false;
          message.guild.musicData.nowPlaying = null;
          console.error(e);
          return voiceChannel.leave();
        });
    })
      .catch((e) => {
        console.error(e);
        return voiceChannel.leave();
      });
  }

  formatDuration(durationObj) {
    const duration = `${durationObj.hours ? `${durationObj.hours}:` : ''}${
      durationObj.minutes ? durationObj.minutes : '00'
    }:${
      // eslint-disable-next-line no-nested-ternary
      durationObj.seconds < 10 ? `0${durationObj.seconds}`
        : durationObj.seconds ? durationObj.seconds
          : '00'
    }`;
    return duration;
  }
};
