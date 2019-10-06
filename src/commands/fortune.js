const { httpGetAsync } = require('./web/httpRequest');

module.exports = {
	name: 'fortune',
	usage: '!fortune',
	description: 'Replies with a random fortune cookie quote.',
	execute (message) {
		let fortunesLimit = 1;
		let fortunesToSkip = Math.floor(Math.random() * (540 - 1 + 1)) + 1;
		console.log(fortunesToSkip);
		let url = `http://fortunecookieapi.herokuapp.com/v1/fortunes?limit=${fortunesLimit}&skip=${fortunesToSkip}`;

		httpGetAsync(url, callback = (response) => {        
			let result = JSON.parse(response);   
			message.channel.send(result[0].message); 
		});
	},
};