const fetch = require("node-fetch");
const Discord = require("discord.js"); // imports the discord library
const fs = require("fs"); // imports the file io library
const client = new Discord.Client(); // creates a discord client

require('dotenv').config() // for hiding tokens and keys
const discord_token = process.env.DISCORD_TOKEN; // discord token

//Import other node modules:
let {Person} = require('./vibecheck_scoreCard.js') ;


//---------------- FIREBASE ------------- : Function definition at the bottom
var firebase = require('firebase');
const { type } = require("os");
var firebaseConfig = {
	apiKey: "AIzaSyBJ8-p0-jZUEKFx5eKnpHgYOxBQ4dwcvr4",
    authDomain: "vibecheck-discord-bot.firebaseapp.com",
    databaseURL: "https://vibecheck-discord-bot-default-rtdb.firebaseio.com",
    projectId: "vibecheck-discord-bot",
    storageBucket: "vibecheck-discord-bot.appspot.com",
    messagingSenderId: "946523489068",
    appId: "1:946523489068:web:bf6dc1cab8fafbd9922289",
    measurementId: "G-5Y9H17PS13"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//---------------- FIREBASE config end



client.once("ready", () => { 
	
	console.log('deployed from mainFeature - branch..') // WARNING: its hard coated
	
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

client.login(discord_token); // starts the bot up 


var vibeCheckers =[];
var vibecheckIsActive = false; // tracker for vibecheck window to allow ppl to vibecheck

var startTime, endTime;
var timeDiff;

var timeoutValueInMs = 12 * ( 60 * 1000 ) ; // window to responds to 'vibecheck @everyone'

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

	/*
			mins to seconds
			1s = 1000ms
			1m = 60 x 1000ms 
			15m = 15 x ( 60 x 1000 )ms
			
	*/

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

	if (textMessage === "test".toLocaleLowerCase()) {
		console.log("Function call -  test ____!_ by:", message.author.username);
	}
	

    if (textMessage === "Vibecheck me".toLocaleLowerCase() ) {
		
		console.log("Function call -  Vibecheck me ____!_ by:", message.author.username)
		//Vibechecks wither username
		const username = message.author.username;
        const vibeCheckString = "VibeChecked " + username; // generates a random number
        message.channel.send(vibeCheckString); // sends a message to the channel with the number

		message.react('👋🏼');

    }

	if ( textMessage === "Vibecheck bol".toLocaleLowerCase() ){
		console.log("Function call -  Vibecheck bol ____!_ by:", message.author.username);
		const string = "Vibecheck khankirpola " + message.author.username;
		message.channel.send(string);
	}

	if ( textMessage === "pl table".toLocaleLowerCase() ){

		plTableCommandFunction()
		.then( response =>{
			console.log('after function call log:');
			console.log(response);
			if( response.length !=0){
				console.log('no response so no reply.');
				message.channel.send(response);
			}
			
		})
		.catch(err =>{
			console.log(err);
		})
	} 

	if ( textMessage === "ucl".toLocaleLowerCase() ){

		console.log("ucl function call ______!_ by:", message.author.username)

		uclFetchFunction()
		.then((response) => {

			var matchString ="@Bangladesh Standard Time:\n";
			response.matches.forEach(element => {
                if( element.status == "SCHEDULED"){
                    matchString += element.awayTeam.name + " vs " + element.homeTeam.name +"\n";
					matchString += changeTimeZone(element.utcDate);
					matchString += "\n";
					matchString += "\n";
					// console.log(matchString);
                }
            });

			console.log('matchSting is::');
			console.log(matchString);
			if( matchString.length != 0){
				message.channel.send(matchString);
			}

		})
		.catch(err => {
			console.error(err); 
		});

	}

	if ( textMessage === "Vibecheck @everyone".toLocaleLowerCase() ){

		console.log("vc @everyone - function call ______!_ by:", message.author.username)
		vibecheckIsActive = true;
		
		start(); // starts clock 

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
			message.react('🤙🏾');
			saveDataToFirebase(message);

		} else{
			message.react('👎🏾');
			// saveDataToFirebase(message);
			console.log('vibin NOT registered due to expired time');
		}
	
	}
});

function changeTimeZone( dateToChange){ //Changes time to BANGLADESH TIME

    const changeThisDate = new Date(dateToChange);
    const options = {
        // day: '2-digit', month: '2-digit', year: '2-digit',  
        // hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZone: 'Asia/Dhaka',
        // timeZoneName: 'short',
        dateStyle: 'full',
        timeStyle: 'short',
        hour12: true,
    }
    const formatter = new Intl.DateTimeFormat('en-GB', options)
    const dateInNewTimezone = formatter.format(changeThisDate) 
    
    return dateInNewTimezone;
}

function uclFetchFunction() {

	console.log('inside uclFetchFunciton');

	return fetch("https://api.football-data.org/v2/competitions/CL/matches", {
			headers: { 'X-Auth-Token': '06d819b33cd245fc89707771ad9759a2' },
			url: 'https://api.football-data.org/v2/competitions/CL/matches',
			dataType: 'json',
			type: 'GET',
		})
		.then(res => res.json())
}
function displayVibeCheckers(message){
	//vibeCheckers <---- this is an array containing the people who vibechecked
	
	if( vibeCheckers.length == 0){
		message.channel.send('No one vibechecked in the given time :( ');
		return;
	}

	var replyString = 'Good vibes:\n';

	vibeCheckers.forEach( person=> {
		replyString += `${person.Name}\t\t\t${person.Score}pts\n`
	})

	console.log(replyString);
	message.channel.send(replyString);
}

/*
	Writes 'dataToWrite' json object to your 'reference' under 'childId' node. 

	Pattern example: 
	vibinScores{ // <---- reference
			allEntries{
				//123456: // <---- childID
				{
					...
					..obj   <---- dataToWrite
				}
			}
	}
*/
function saveDataToFirebase(message) {
	var currentDate = new Date();
	var vibinScoreObj = {
		
		viberId:message.author.id, //id
		
		person:new Person(  //person
			message.author.username.toString(), //name 
			elapsedTimeForScore(),	// score from window
			message.author.id // user id
			),
			
		timeOfEntry: currentDate.toString(), 

		vibinScore:elapsedTimeForScore(),  //score

	}
	const path = 'vibinScores/allEntries';
	saveEachVibinScores ( path, currentDate.getTime(), vibinScoreObj )
}



function registerVibecheck(message){
	/*
	Steps to follow:
	-check if the time to vibecheck is still valid
		if(valid){
			push (username + score) to array
		}
	-When vibecheck time runs out
		Pop the array to display the vibecheckers with score
	*/
	
	const username = message.author.username.toString();

	var person1 = new Person(
		message.author.username.toString(), 
		elapsedTimeForScore(),
		message.author.username.id);
	

	function checkAvailability(vibecheckers, username) {
		return vibecheckers.some(person => person.Name === username);
	}
	
	personExists= checkAvailability(vibeCheckers, username );
	

	if ( !personExists ){
		vibeCheckers.push(
			person1
		);
	}
}

/*
	Return Promise with Priemier League Table Top Teams
*/
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

		printArray.push('\tTeam\t\t\tPlayed | Pts')
		for ( var i=0 ; i< count; i++){
			printString = `${response.standings[0].table[i].position}:${response.standings[0].table[i].team.name}`;
			
			printString +="\t\t";
			if(response.standings[0].table[i].team.name.length < 14){
				printString +="\t";
			}
			printString +=`${response.standings[0].table[i].playedGames} | ${response.standings[0].table[i].points}`;
			
			printArray.push(printString);
		}
		return printArray.join('\n');
	})
}


var db = firebase.database();  // FIREBASE Database Function Definitions

/* **********************************************************
						Firebase - READ
    **********************************************************
*/ 


/*
    Reads data asynchronously with the 'path' argument specified. 
    RETURNING A PROMISE.
    
    Ex path can be: /vibinScores/allEntries/112/
*/
function readData (path){
    var ref = db.ref(path); 

    return ref.once("value", function(snapshot) {
        // console.log('\n-----fetched data:\n');
        console.log('\tReading: '+path);
        console.log(snapshot.val());
        return snapshot.val();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    })
    .then( snap =>{
            return snap.val();
        })
}


/* **********************************************************
						Firebase - Write
    **********************************************************
*/ 
/*
    Writes 'dataToWrite' json object to your 'reference' under 'childId' node. 

    Pattern example: 
    vibinScores{ // <---- reference
            allEntries{
                //123456: // <---- childID
                {
                    ...
                    ..obj   <---- dataToWrite
                }
            }
    }
*/
function saveEachVibinScores( reference, childId, dataToWrite){

    //convertes reference to string if not string
    if((typeof reference) != 'string'){
        reference = reference.toString();
    }
	
	console.log('...writing to path:' + reference +' with dataToWrite:');
	console.log(dataToWrite);

    var ref = db.ref(reference); //vibinScores
    usersRef = ref.child(childId);
    usersRef.set(
        dataToWrite
    );

}
