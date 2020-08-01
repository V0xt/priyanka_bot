module.exports = async (client) => {
  console.log('Connected as ' + client.user.tag);
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

  console.log('Servers:');
  client.guilds.cache.map((guild) => {
    console.log(' - ' + guild.name);
    guild.channels.cache.map((channel) => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
    });
  });

  console.log('Ready!');
  client.user.setActivity(`& serving ${client.guilds.cache.size} servers`, { type: 'WATCHING' });
};
