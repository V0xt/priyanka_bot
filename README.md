# Priyanka JavaScript bot for Discord

I learn to program and in parallel with studies, i'm writing this bot for myself and my friends. Feel free to use it's code for own projects, report bugs or send pull requests.    

## Features

Visit [wiki](https://github.com/V0xt/priyanka_bot/wiki) or try use !help to get a full list of available commands.

## Getting started

### Requirements

- [Node & NPM](https://nodejs.org/en/) <br>
- [FFMPEG](https://www.ffmpeg.org/)

### Installation
1. Download project
2. Install dependencies `npm install`
3. Create .env file with the following contents: <br>
	prefix = <desired_command_prefix> <br>
	BOT_TOKEN = <discord_bot_token>

4. Run the bot with `npm start` or `node index.js`
5. Invite bot to your server and type `!help` in chat to get list of commands.
     
### Setting up APIs:
For some commands to work you will need to add own API keys to .env file:

- Weather commands: [openWeather](https://home.openweathermap.org/api_keys); <br>
- Ethereum stats: [etherscan](https://etherscan.io/myapikey); <br>
- Wolfram: [wolfram](https://products.wolframalpha.com/api/). (In dev)<br> 

## Useful links

- [Discord.js Guide](https://discordjs.guide/) <br>
- [AnIdiotsGuide](https://anidiots.guide/)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
