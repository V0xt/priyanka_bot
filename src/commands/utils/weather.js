const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const weatherApi = process.env.openWeatherApi;

module.exports = class OpenWeatherAPI extends Command {
	constructor(client) {
		super(client, {
			name: 'weather',
			description: 'Shows the current weather in given city.',
			group: 'utils',
			memberName: 'weather',
			guildOnly: false,
			aliases: ['temp', 'sky'],
			usage: '!weather <cityName>',
			throttling: {
				usages: 2,
				duration: 10,
			},
			args: [
				{
					key: 'city',
					prompt: 'Which city would you like to know the weather in?',
					type: 'string',
				},
			],
		});
	}

	async run(message, { city }) {
		const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${weatherApi}`).then(response => response.json());
		message.say(`${result.name}, ${result.sys.country}, ${result.weather[0].description}\nTemp: ${Math.floor(result.main.temp - 273.15)} °C\nWind speed: ${result.wind.speed} m/s`);
	}
};