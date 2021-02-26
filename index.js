const fetch = require("node-fetch");

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


		console.log("Function call Vibecheck me ______!_")
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

	if ( textMessage === "khela hobe".toLocaleLowerCase() ){

		console.log("khelaHobe function call ______!_")
		const string = khelaHobe();

		message.channel.send(string);
	}


});

function khelaHobe(){
	fetch("https://heisenbug-champions-league-live-scores-v1.p.rapidapi.com/api/championsleague/table?group=H", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "97497578abmsh264e1759fed3e9ep111712jsn778a5a65565c",
		"x-rapidapi-host": "heisenbug-champions-league-live-scores-v1.p.rapidapi.com"
	}
	})
	.then(response => {
		return response.records[1].team;
		console.log(response);
	})
	.catch(err => {
		console.error(err);
	});

}

