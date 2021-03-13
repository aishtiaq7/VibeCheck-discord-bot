const fetch = require("node-fetch");

const Discord = require("discord.js"); // imports the discord library
const fs = require("fs"); // imports the file io library

const client = new Discord.Client(); // creates a discord client
const token = fs.readFileSync("token.txt").toString(); // gets your token from the file

//Import other node modules:
let {Person} = require('./vibecheck_scoreCard.js') ;
//var person1 = new Person('Awshaf');
//console.log(person1);

//--------------------------------


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
	console.log('\n');

});

client.login(token); // starts the bot up 

var vibeCheckers =[];
var vibecheckIsActive = false; // tracker for vibecheck window to allow ppl to vibecheck

var startTime, endTime;
var timeDiff;

var timeoutValueInMs = 5 * ( 60 * 1000 ) ; // window to responds to 'vibecheck @everyone'

function start() {
	startTime = new Date();
	
};

function elapsedTimeForScore() {

	if( !vibecheckIsActive){
		return 0;
	}
	var timeSoFar = new Date();
	var timeScore = timeSoFar - startTime;

	timeScore /= 1000; //strip ms;

	//timeScore <-- now it contains the elapsed time in SECONDS

	//Converting it to score of 100:
	// console.log('timeScore', timeScore);
	// console.log('timeoutValueInMs',timeoutValueInMs);
	// console.log('timeScore/timeoutVaueInMs',timeScore/timeoutValueInMs );
	// console.log('Math.floor( (timeScore/timeoutValueInMs) *100 )', Math.floor( (timeScore/timeoutValueInMs) *100 ));

	var score = Math.floor( (1 -(timeScore/ (timeoutValueInMs/1000)) ) *100 );
	
	return score;
}

function end() {
	endTime = new Date();
	timeDiff = endTime - startTime; //in ms
	// strip the ms
	timeDiff /= 1000;

	// get seconds 
	var seconds = Math.round(timeDiff);
	console.log(seconds + " seconds window ran");

		
	// // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
	// var seconds = Math.round(timeDiff % 60);

	// // remove seconds from the date
	// timeDiff = Math.floor(timeDiff / 60);

	// // get minutes
	// var minutes = Math.round(timeDiff % 60);

	// // remove minutes from the date
	// timeDiff = Math.floor(timeDiff / 60);

	// // get hours
	// var hours = Math.round(timeDiff % 24);

	// // remove hours from the date
	// timeDiff = Math.floor(timeDiff / 24);

	// // the rest of timeDiff is number of days
	// var days = timeDiff ;
}

 
//******************************** MESSAGES ********************************
client.on("message", message => { // runs whenever a message is sent

	//message.content
	var textMessage = message.content;
	textMessage = textMessage.toLowerCase();

	
	

    if (textMessage === "Vibecheck me".toLocaleLowerCase() ) {
		
		
		console.log("Function call -  Vibecheck me ____!_ by:", message.author.username)
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

		console.log("ucl function call ______!_ by:", message.author.username)

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

	if ( textMessage === "Vibecheck @everyone".toLocaleLowerCase() ){

		console.log("vc now - function call ______!_ by:", message.author.username)
		vibecheckIsActive = true;
		

		start(); // starts clock 

				
		/*
			mins to seconds
			1s = 1000ms
			1m = 60 x 1000ms 
			15m = 15 x ( 60 x 1000 )ms
			
		*/

		// const timeoutValueInMs = 25 * ( 60 * 1000 );
		// timeoutValueInMs = 11000; *******GLOBAL VALUE ****** 
		setTimeout( ()=>{
			vibecheckIsActive = false;
			end();
			displayVibeCheckers(message);

			vibeCheckers =[];

			console.log(`endTime() called after ${timeoutValueInMs/1000}s from setTimeout`);
		}, timeoutValueInMs);

		message.channel.send(`Vibecheck window closes in:${timeoutValueInMs/1000/60}min`);
		
	}

	if ( textMessage === "vibin".toLocaleLowerCase() ){
		console.log("vibin function call ______!_by:", message.author.username)

		console.log('===vibin score:', elapsedTimeForScore() );
		if( vibecheckIsActive ){
			registerVibecheck(message);
		} else{
			console.log('vibin NOT registered due to expired time');
		}
	
	}
});


function displayVibeCheckers(message){
	//YOU HAVE vibeCheckers <---- this is an array containing the people who vibechecked
	
	if( vibeCheckers.length == 0){
		message.channel.send('No one vibechecked in the given time :( ');
		return;
	}

	var replyString = 'Good vibes:\n';

	// console.log('loggin vibeCheckers:');

	vibeCheckers.forEach( person=> {
		replyString += `${person.Name}\t\t\t${person.Score}pts\n`
	})

	console.log(replyString);
	message.channel.send(replyString);
	// console.log(vibeCheckers);
}



function registerVibecheck(message){
	/*
	Steps to follow:
	-check if the time to vibecheck is still valid
		if(valid){
			push username + score to array
		}
	-When vibecheck time runs out
		Pop the array to display the vibecheckers with score

	*/
	
	const username = message.author.username.toString();

	var person1 = new Person(
		message.author.username.toString(), 
		elapsedTimeForScore()
		);
	

	function checkAvailability(vibecheckers, username) {
		return vibecheckers.some(person => person.Name === username);
	}
	
	personExists= checkAvailability(vibeCheckers, username );
	

	if ( !personExists ){
		// console.log(`pushing ${person1.Name}`);
		vibeCheckers.push(
			person1
		);
	}

	// console.log('logging vibeChecker array:');
	// console.log(vibeCheckers);
	

}


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

