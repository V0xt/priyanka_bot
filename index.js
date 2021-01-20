/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
require('dotenv').config();
const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const Canvas = require('canvas');
const path = require('path');
const fs = require('fs');

Discord.Structures.extend('Guild', (Guild) => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        volume: 1,
        songDispatcher: null,
      };
    }
  }
  return MusicGuild;
});

const client = new Commando.CommandoClient({
  commandPrefix: process.env.prefix,
  owner: process.env.ownerID,
  unknownCommandResponse: false,
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['admin', 'Admin Commands'],
    ['crypto', 'Crypto Commands'],
    ['music', 'Music Commands'],
    ['other', 'Other Commands'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    eval: false,
  })
  .registerCommandsIn(path.join(process.cwd(), 'src/commands'));

fs.readdir('./src/events/', (err, files) => {
  if (err) console.error(err);
  files.forEach((file) => {
    const eventPath = `./src/events/${file}`;
    const event = require(eventPath);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  });
});

const applyText = (canvas, text) => {
  const ctx = canvas.getContext('2d');
  let fontSize = 70;

  do {
    ctx.font = `${fontSize -= 10}px sans-serif`;
  } while (ctx.measureText(text).width > canvas.width - 300);

  return ctx.font;
};

client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.channels.cache.find((ch) => ch.name === 'general');
  if (!channel) return;

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage('./src/img/wallpaper.jpg');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

  ctx.font = applyText(canvas, `${member.displayName}!`);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

  channel.send(`Welcome to the server, ${member}!`, attachment);
});

client.login(process.env.BOT_TOKEN);
