const Discord = require('discord.js')
const client = new Discord.Client()
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    // List servers the bot is connected to
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })
    // Sending message to channel
    var generalChannel = client.channels.get("625350794949951491") // Replace with known channel ID
    generalChannel.send("Hello, world!") 

    // Set bot status to: "Playing with JavaScript"
    client.user.setActivity("with JavaScript")
    // Alternatively, you can set the activity to any of the following:
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})


    ////////////////////////////////////////
    // Sending attachment
    // Provide a path to a local file
    // const localFileAttachment = new Discord.Attachment('E:\\02_Discord_bot\\img\\logo.png')
    // generalChannel.send(localFileAttachment)

    // Provide a URL to a file
    // const webAttachment = new Discord.Attachment('https://www.devdungeon.com/sites/all/themes/devdungeon2/logo.png')
    // generalChannel.send(webAttachment)
    ////////////////////////////////////////
})

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    // Check if received message is a command
    if (receivedMessage.content.startsWith("!")) { 
        processCommand(receivedMessage)
    }

    // Check if received message is a question
    // if (receivedMessage.content.endsWith("?")) { 
    //     processQuestion(receivedMessage)
    // }    
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ")           // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0]                // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1)               // All other words are arguments/parameters/options for the command
    

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments)              // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else if (primaryCommand == "8ball") {
        randomWord(arguments, receivedMessage)
    } else if (primaryCommand == 'ping') {
        receivedMessage.channel.send("Pong!")
    } else if (primaryCommand == 'fortune') {
        getFortune(arguments, receivedMessage);
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!multiply`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + "`" + arguments + "`")
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1 
    arguments.forEach((value) => {
        product = product * parseFloat(value)        
    })
    receivedMessage.channel.send("The product of " + arguments.join(', ') + " multiplied together is: " + product.toString())
}

function randomWord (arguments, receivedMessage) {
    let answers = [
        'yes',
        'no',
        'definetly not',
        'maybe'
    ]    
    let randomAnswer = Math.floor(Math.random() * Math.floor(answers.length));
    receivedMessage.channel.send('I think `' + answers[randomAnswer] + '.`')
}

function getFortune(arguments, receivedMessage) {
    let fortunesLimit = 1;
    let fortunesToSkip = Math.floor(Math.random() * (540 - 1 + 1)) + 1;
    console.log(fortunesToSkip);
    let url = `http://fortunecookieapi.herokuapp.com/v1/fortunes?limit=${fortunesLimit}&skip=${fortunesToSkip}`;

    httpGetAsync(url, function(response) {        
        let result = JSON.parse(response);   
        receivedMessage.channel.send(result[0].message); 
    });
}

function httpGetAsync(url, callback) {
    let xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.onload = function (e) {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {                                 
                console.log(JSON.parse(xmlHttp.responseText));   
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



// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = "NjI1MzQ5OTY3NzMyNjcwNDY0.XYeS2Q.r00pgwITQczRyjpeVsx5m9Juhjc"

client.login(bot_secret_token)