const Discord = require("discord.js"); // imports the discord library
const fs = require("fs"); // imports the file io library

const client = new Discord.Client(); // creates a discord client
const token = fs.readFileSync("token.txt").toString(); // gets your token from the file
  
client.once("ready", () => { // prints "Ready!" to the console once the bot is online
	console.log("Ready!");
});

client.login(token); // starts the bot up





//******************************** MESSAGES ********************************
client.on("message", message => { // runs whenever a message is sent

	//message.content
	var textMessage = message.content;
	textMessage = textMessage.toLowerCase();

	
    if (textMessage === "Vibecheck me".toLocaleLowerCase() ) { 

		//Vibechecks wither username 
		const username = message.author.username;
        const vibeCheckString = "VibeChecked " + username; // generates a random number
        message.channel.send(vibeCheckString); // sends a message to the channel with the number

    }

	if ( textMessage === "Vibecheck bol".toLocaleLowerCase() ){
		const string = "Vibecheck khankirpola " + message.author.username;
		message.channel.send(string);
	}

	if (message.content === 'what is my avatar') {
		// Send the user's avatar URL
		message.reply(message.author.displayAvatarURL());
	  }



});