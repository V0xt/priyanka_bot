const { httpGetAsync } = require('./web/httpRequest');

module.exports = {
	name: 'weather',
	usage: '!weather cityName',
	description: 'Shows the current weather in given city.',
	execute (message) {		
		let cityName = message.content.slice(9);
		console.log(cityName);
		let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=49bd59f012549862afe17a39f972effb`;

		httpGetAsync(url, callback = (response) => {        
			let result = JSON.parse(response);  
			console.log(result);
			console.log(result.weather[0]);
			message.channel.send(`${result.name}, ${result.sys.country}, ${result.weather[0].description}\nTemp: ${Math.floor(result.main.temp - 273.15)} °C\nWind speed: ${result.wind.speed} m/s`); 
		});
	},
};