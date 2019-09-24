const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const client = new Discord.Client();
client.login(token);

const commandToFuncMapper = ({    
    'help' : (arguments, receivedMessage) => helpCommand (arguments, receivedMessage),
    'multiply' : (arguments, receivedMessage) => multiplyCommand (arguments, receivedMessage),
    '8ball' : (arguments, receivedMessage) => randomWord (arguments, receivedMessage),
    'ping' : (arguments, receivedMessage) => receivedMessage.channel.send ("Pong!"),
    'fortune' : (arguments, receivedMessage) => getFortune (arguments, receivedMessage),
    'bitcoin' : (arguments, receivedMessage) => getCurrentBitcoinPrice (arguments, receivedMessage),
    'weather' : (arguments, receivedMessage) => getCurrentWeather (arguments, receivedMessage),
    'play' : (arguments, receivedMessage) => play (arguments, receivedMessage),
    'skip' : (arguments, receivedMessage) => skip (arguments, receivedMessage),
    'stop' : (arguments, receivedMessage) => stop (arguments, receivedMessage)    
});
        
client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    // List servers the bot is connected to
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);
        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        })
    });
    // Sending message to channel
    var generalChannel = client.channels.get("625350794949951491"); // Replace with known channel ID
    generalChannel.send("Hello, world!"); 

    client.user.setActivity("with JavaScript");

    ////////////////////////////////////////
    // Sending attachment
    // Provide a path to a local file
    // const localFileAttachment = new Discord.Attachment('E:\\02_Discord_bot\\img\\logo.png')
    // generalChannel.send(localFileAttachment)
    // Provide a URL to a file
    // const webAttachment = new Discord.Attachment('https://www.devdungeon.com/sites/all/themes/devdungeon2/logo.png')
    // generalChannel.send(webAttachment)
    ////////////////////////////////////////
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', (receivedMessage) => {    
    if (receivedMessage.author.bot) {
        return
    }

    if (!receivedMessage.content.startsWith('!')) {
        return;
    }
    else {
        processCommand(receivedMessage);
    }
});

processCommand = (receivedMessage) => {
    let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ");           // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0];                // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1);               // All other words are arguments/parameters/options for the command
    
    console.log("Command received: " + primaryCommand);
    console.log("Arguments: " + arguments);              // There may not be any arguments
     
    try {
        commandToFuncMapper[primaryCommand](arguments, receivedMessage);
    }
    catch {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!info`");
    };
}

function helpCommand (arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + "`" + arguments + "`");
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`");
    }
}

function multiplyCommand (arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`");
        return
    }
    let product = 1 
    arguments.forEach((value) => {
        product = product * parseFloat(value);        
    })
    receivedMessage.channel.send("The product of " + arguments.join(', ') + " multiplied together is: " + product.toString());
}

function randomWord (arguments, receivedMessage) {
    let answers = [
        'yes',
        'no',
        'definetly not',
        'maybe'
    ]    
    let randomAnswer = Math.floor(Math.random() * Math.floor(answers.length));
    receivedMessage.channel.send('I think `' + answers[randomAnswer] + '.`');
}

function getFortune (arguments, receivedMessage) {
    let fortunesLimit = 1;
    let fortunesToSkip = Math.floor(Math.random() * (540 - 1 + 1)) + 1;
    console.log(fortunesToSkip);
    let url = `http://fortunecookieapi.herokuapp.com/v1/fortunes?limit=${fortunesLimit}&skip=${fortunesToSkip}`;

    httpGetAsync(url, callback = (response) => {        
        let result = JSON.parse(response);   
        receivedMessage.channel.send(result[0].message); 
    });
}

function getCurrentBitcoinPrice (arguments, receivedMessage) {
    let url = 'https://blockchain.info/ticker';

    httpGetAsync(url, callback = (response) => {
        let result = JSON.parse(response);
        console.log(result.USD);        
        receivedMessage.channel.send(`BUY: ${result.USD.buy}${result.USD.symbol}\nSELL: ${result.USD.sell}${result.USD.symbol}`);
    });
}

function getCurrentWeather (arguments, receivedMessage) {
    let url = `api.openweathermap.org/data/2.5/weather?q=${arguments}`;

    httpGetAsync(url, callback = (response) => {
        let result = JSON.parse(response);
        console.log(result);
        //receivedMessage.channel.send(result[0].message);
    });
}

httpGetAsync = (url, callback) => {
    let xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open("GET", url, true);             // true for asynchronous
    xmlHttp.onload = function (e) {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {                                 
                //console.log(JSON.parse(xmlHttp.responseText));   
                callback(xmlHttp.responseText);             
            } else {
                console.error(xmlHttp.statusText);
            }
        }
    };
    xmlHttp.onerror = function (e) {
        console.error(xmlHttp.statusText);
    };
    xmlHttp.send(null);       
}


