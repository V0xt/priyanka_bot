const fetch = require('node-fetch');

module.exports = {
	name: 'weather',
	description: 'Shows the current weather in given city.',
	guildOnly: false,
	aliases: ['temp', 'sky'],
	usage: '!weather <cityName>',
	cooldown: 5,

	async execute(message, args) {
		if (!args.length) {
			return message.channel.send('Please, provide city name! Example:\n`!weather Moscow`');
		}

		const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${args}&APPID=49bd59f012549862afe17a39f972effb`).then(response => response.json());
		message.channel.send(`${result.name}, ${result.sys.country}, ${result.weather[0].description}\nTemp: ${Math.floor(result.main.temp - 273.15)} °C\nWind speed: ${result.wind.speed} m/s`);
	},
};