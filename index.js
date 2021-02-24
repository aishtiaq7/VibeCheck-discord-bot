const Discord = require("discord.js"); // imports the discord library
const fs = require("fs"); // imports the file io library

const client = new Discord.Client(); // creates a discord client
const token = fs.readFileSync("token.txt").toString(); // gets your token from the file
  
client.once("ready", () => { // prints "Ready!" to the console once the bot is online
	console.log("Ready!");
});

client.login(token); // starts the bot up


client.on("message", message => { // runs whenever a message is sent

	//
    if (message.content === "Vibecheck me") { // checks if the message says "?random"

		//Vibechecks wither username 
		const username = message.author.username;
        const vibeCheckString = "VibeCheck " + username; // generates a random number
        message.channel.send(vibeCheckString); // sends a message to the channel with the number

		
    }



});