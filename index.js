const fetch = require("node-fetch");

const Discord = require("discord.js"); // imports the discord library
const fs = require("fs"); // imports the file io library

const client = new Discord.Client(); // creates a discord client
const token = fs.readFileSync("token.txt").toString(); // gets your token from the file

client.once("ready", () => { 
	
	console.log('deployed from main branch..')
	
	
	console.log("Ready!");
	console.log('__npm start at:');
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + "hrs:" + today.getMinutes() + "mins:" + today.getSeconds()+"s";
	var dateTime = date+' '+time;

	console.log(date);
	console.log(time);

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

	if ( textMessage === "pl table".toLocaleLowerCase() ){

		//Testing function calls:
		plTableCommandFunction()
		.then( response =>{
			console.log('after function call log:');
			console.log(response);
			message.channel.send(response);
			
		})
		.catch(err =>{
			console.log(err);
		})


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
			var matchString ="";
			response.matches.forEach(element => {
                if( element.status == "SCHEDULED"){
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

function plTableCommandFunction(){


	return fetch("http://api.football-data.org/v2/competitions/2021/standings", {
		headers: { 'X-Auth-Token': '06d819b33cd245fc89707771ad9759a2' },
		url: 'https://api.football-data.org/v2/competitions/CL/matches',
		dataType: 'json',
		type: 'GET',
	})
	.then(res => res.json())
	.then((response) => {

		var printArray = [];
		var printString = "";
		var count =10;  // Max num of top teams to be displayed
		//WITH FOR LOOP
		printArray.push('\tTeam\t\t\tPlayed | Pts')
		for ( var i=0 ; i< count; i++){
			printString = `${response.standings[0].table[i].position}:${response.standings[0].table[i].team.name}`;
			
			printString +="\t\t";
			if(response.standings[0].table[i].team.name.length < 14){
				printString +="\t";
			}
			printString +=`${response.standings[0].table[i].playedGames} | ${response.standings[0].table[i].points}`;
			
			// console.log(printString);
			printArray.push(printString);

			
		}
		return printArray.join('\n');
	})

}

