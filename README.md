# Priyanka JavaScript bot for Discord

I learn to program and in parallel with studies, i'm writing this bot for myself and my friends. Feel free to use it's code for own projects, report bugs or send pull requests.    

## Features

Visit [wiki](https://github.com/V0xt/priyanka_bot/wiki) or run the bot and use `help` command to get a full list of available commands.

## Getting started

### Requirements

- [Node & NPM](https://nodejs.org/en/) <br>
- [FFMPEG](https://www.ffmpeg.org/)

### Installation
1. Download project
2. Install dependencies `npm install`
3. Create .env file with the following contents: <br>
	prefix = <desired_command_prefix> <br>
	BOT_TOKEN = <discord_bot_token> <br>
	ownerID = <your_discord_id>

4. Run the bot with `npm start` or `node index.js`
5. Invite bot to your server and type `!help` in chat to get list of commands.
     
### Setting up APIs:
For some commands to work you will need to add own API keys to .env file:

- Weather commands: [openWeatherApi](https://home.openweathermap.org/api_keys) <br>
- Ethereum stats: [ethApi](https://etherscan.io/myapikey) <br>
- YouTube Data API: [youtubeAPI](https://developers.google.com/youtube/v3/getting-started) <br> 
- (In dev): [wolframAlpha](https://products.wolframalpha.com/api/) 

## Thanks for help

- [Discord.js Guide](https://discordjs.guide/) <br>
- [AnIdiotsGuide](https://anidiots.guide/) <br>
- [Music Guide](https://dev.to/galnir/how-to-write-a-music-command-using-the-discord-js-library-462f) 

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
