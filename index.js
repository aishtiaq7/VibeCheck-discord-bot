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

	if ( textMessage === "ucl".toLocaleLowerCase() ){

		console.log("ucl function call ______!_")


		// fetch("https://heisenbug-champions-league-live-scores-v1.p.rapidapi.com/api/championsleague/match/events?team1=Paris%20Saint-Germain&team2=Real%20Madrid", {
		// "method": "GET",
		// "headers": {
		// 	"x-rapidapi-key": "97497578abmsh264e1759fed3e9ep111712jsn778a5a65565c",
		// 	"x-rapidapi-host": "heisenbug-champions-league-live-scores-v1.p.rapidapi.com"
		// 	}
		// })
		fetch("https://api.football-data.org/v2/competitions/CL/matches", {
			headers: { 'X-Auth-Token': '06d819b33cd245fc89707771ad9759a2' },
			url: 'https://api.football-data.org/v2/competitions/CL/matches',
			dataType: 'json',
			type: 'GET',
		})
		.then(res => res.json())
		.then((response) => {
			// response.matches.forEach(element => {
            //     if( element.status == "SCHEDULED"){
			// 		const matchString = element.awayTeam.name + " vs " + element.homeTeam.name +" | " + element.utcDate;
			// 		console.log(matchString);
            //     }
            // });
			console.log("console logging response");
			// console.log(response);
			return response;
		})
		.then((response) => {
			response.matches.forEach(element => {
    
                if( element.status == "SCHEDULED"){
                    // console.log(element.awayTeam + " vs " + element.homeTeam +" | " + element.utcDate);
                    const matchString = element.awayTeam.name + " vs " + element.homeTeam.name +" | " + element.utcDate;
					console.log(matchString);
					message.channel.send(matchString);
                }
            });
		})
		.catch(err => {
			console.error(err);
		});
	
	}


});


