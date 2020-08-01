module.exports = (client, guild) => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!\nOwner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
};