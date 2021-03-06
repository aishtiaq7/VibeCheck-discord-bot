const fetch = require("node-fetch");

const Discord = require("discord.js"); // imports the discord library
const fs = require("fs"); // imports the file io library

const client = new Discord.Client(); // creates a discord client
const token = fs.readFileSync("token.txt").toString(); // gets your token from the file
  
client.once("ready", () => { // prints "Ready!" to the console once the bot is online
	console.log("Ready!");

	//Get list of members from a server
	// channel id  = 810512882907349003

	// ****************************** Working directory:: 

	// const Guilds = client.guilds.cache.map(guild => guild);
    // console.log(Guilds);
    // console.log('-------------------------------------------------');
    // console.log(Guilds[0].gu);


	// var today = new Date();
	// var dd = String(today.getDate()).padStart(2, '0');
	// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	// var yyyy = today.getFullYear();

	// today = mm + '/' + dd + '/' + yyyy;
	// today +="\n";

	// console.log(today);
	
	console.log('time of start npm:');
	
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;

	console.log(date);
	console.log(time);
	//CU

	// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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

		fetch("https://api.football-data.org/v2/competitions/CL/matches", {
			headers: { 'X-Auth-Token': '06d819b33cd245fc89707771ad9759a2' },
			url: 'https://api.football-data.org/v2/competitions/CL/matches',
			dataType: 'json',
			type: 'GET',
		})
		.then(res => res.json())
		.then((response) => {

			console.log("console logging response");
			return response;
		})
		.then((response) => {

			var matchString ="";
			response.matches.forEach(element => {
                if( element.status == "SCHEDULED"){
                    // console.log(element.awayTeam + " vs " + element.homeTeam +" | " + element.utcDate);
                    matchString += element.awayTeam.name + " vs " + element.homeTeam.name +" | " + element.utcDate;
					// console.log(matchString);
					matchString += "\n";
					console.log(matchString);
                }
            });
			message.channel.send(matchString);
			
		})
		.catch(err => {
			console.error(err);
		});
	
	}




});


