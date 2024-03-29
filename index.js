const fetch = require("node-fetch");
const Discord = require("discord.js"); // imports the discord library
const client = new Discord.Client(); // creates a discord client

require("dotenv").config(); // to preload the env values into process.env
const discord_token = process.env.DISCORD_TOKEN; // discord token
const football_x_auth_token = process.env.FOOTBALL_X_AUTH_TOKEN; // football-data.org token

let { Person } = require("./vibecheck_scoreCard.js");

// Open AI
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

var vibeCheckers = [];
var vibecheckIsActive = false; // vibecheck everyone window

var startTime, endTime;
var timeDiff;

var timeoutValueInMs = 1 * (60 * 1000); // window to responds to 'vibecheck @everyone'

function start() {
  startTime = new Date();
}
function elapsedTimeForScore() {
  if (!vibecheckIsActive) {
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
  var score = Math.floor((1 - timeScore / (timeoutValueInMs / 1000)) * 100);
  return score;
}
function end() {
  endTime = new Date();
  timeDiff = endTime - startTime; //in ms
  timeDiff /= 1000;

  // get seconds
  var seconds = Math.round(timeDiff);
  console.log(seconds + " seconds window ran");
}

client.once("ready", () => {
  console.log("Ready!");
  console.log("__npm start at:");
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() +
    "hrs:" +
    today.getMinutes() +
    "mins:" +
    today.getSeconds() +
    "s";
  var dateTime = date + " " + time;

  console.log(date);
  console.log(time);
  console.log("\n");

  var isTrigger = false; //Trigger Once???
  if (isTrigger) {
    isTrigger = false;
    var sendMsg = `Eid Mubarak guys!!\nStay safe and keep vibin 🤙🏾 `;
    const channelId = "810512883367936012";
    sendMsgToChannel(sendMsg, channelId);
    sendMsgToChannel("vibecheck @everyone", channelId);

    /*			Reference to channels:
		Robi's Server > spamming = 839029246567252000
		Vibechek > no-smoking zone = 810512883367936012

		*/
  }
});

client.login(discord_token); // starts the bot up

function sendMsgToChannel(msg, id) {
  client.channels.fetch(id).then((channel) => {
    channel.send(msg);
    // console.log('msg:', msg);
    // console.log('id:', id);
  });
}

async function handleChatGPTResponse(message, msg) {
  
  try {
    if (msg == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    // trigger OpenAI completion
    console.log("msg:", msg);
    const fakemsg = "what year is this chatgpt?";

    await openai
      .createCompletion({
        model: "text-davinci-003",
        // prompt: fakemsg,
        prompt: "Say this is a test",
        temperature: 0.9,
        max_tokens: 250,
        // top_p: 1,
        // frequency_penalty: 0.0,
        // presence_penalty: 0.6,
        // stop: ["Human:", " AI:"],
      })
      .then((response) => {
        console.log(response.data.choices[0].text);
      })
      .catch((err) => {
        console.log('ERRR in catch block ->', err);
      });
  } catch (error) {
    console.log("-->err in catch block below");
    // console.log(error);
  }
  // message.channel.send(msg);
  console.log("------end--");
}

//******************************** MESSAGES ********************************
client.on("message", (message) => {
  //message.content
  var textMessage = message.content;
  textMessage = textMessage.toLowerCase();

  if (textMessage === "tst".toLocaleLowerCase()) {
    handleChatGPTResponse(message, textMessage);
  }

  if (textMessage === "test".toLocaleLowerCase()) {
    console.log("Function call -  test ____!_ by:", message.author.username);
  }

  if (textMessage === "Vibecheck me".toLocaleLowerCase()) {
    console.log("DISCORD_TOKEN --> ", process.env.DISCORD_TOKEN);

    console.log(
      "Function call -  Vibecheck me ____!_ by:",
      message.author.username
    );
    //Vibechecks wither username
    const username = message.author.username;
    const vibeCheckString = "VibeChecked " + username; // generates a random number
    message.channel.send(vibeCheckString); // sends a message to the channel with the number
    message.react("👋🏼");
  }

  if (textMessage === "Vibecheck bol".toLocaleLowerCase()) {
    console.log(
      "Function call -  Vibecheck bol ____!_ by:",
      message.author.username
    );
    const string = "Vibecheck khankirpola " + message.author.username;
    message.channel.send(string);
  }

  if (textMessage === "pl table".toLocaleLowerCase()) {
    plTableCommandFunction()
      .then((response) => {
        console.log("after function call log:");
        console.log(response);
        if (response.length != 0) {
          console.log("no response so no reply.");
          message.channel.send(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (textMessage === "ucl".toLocaleLowerCase()) {
    console.log("ucl function call ______!_ by:", message.author.username);
    uclFetchFunction()
      .then((response) => {
        var matchString = "@Bangladesh Standard Time:\n";
        response.matches.forEach((element) => {
          if (element.status == "SCHEDULED") {
            matchString +=
              element.awayTeam.name + " vs " + element.homeTeam.name + "\n";
            matchString += changeTimeZone(element.utcDate);
            matchString += "\n";
            matchString += "\n";
          }
        });

        console.log("matchSting is::");
        console.log(matchString);
        if (matchString.length != 0) {
          message.channel.send(matchString);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //   if (textMessage === "Vibecheck @everyone".toLocaleLowerCase()) {
  if (textMessage === "vbe".toLocaleLowerCase()) {
    console.log(
      "vc @everyone - function call ______!_ by:",
      message.author.username
    );
    vibecheckIsActive = true;

    start(); // starts clock

    console.log("date", Date().toString);
    setTimeout(() => {
      vibecheckIsActive = false;
      end();
      displayVibeCheckers(message);

      vibeCheckers = [];

      console.log(
        `endTime() called after ${timeoutValueInMs / 1000}s from setTimeout`
      );
    }, timeoutValueInMs);

    message.channel.send(
      `Vibecheck window closes in:${timeoutValueInMs / 1000 / 60}min`
    );
  }

  if (textMessage === "vibin".toLocaleLowerCase()) {
    console.log("vibin function call ______!_by:", message.author.username);

    if (vibecheckIsActive) {
      registerVibecheck(message);
      message.react("🤙🏾");
      registerEachVibinScore(message);
      console.log("===vibin score:", elapsedTimeForScore());
    } else {
      message.react("👎🏾");
      console.log("vibin NOT registered");
    }
  }
});

// Helper Functions:
function changeTimeZone(dateToChange) {
  //Converts to BD time
  const changeThisDate = new Date(dateToChange);
  const options = {
    // day: '2-digit', month: '2-digit', year: '2-digit',
    // hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: "Asia/Dhaka",
    // timeZoneName: 'short',
    dateStyle: "full",
    timeStyle: "short",
    hour12: true,
  };
  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const dateInNewTimezone = formatter.format(changeThisDate);

  return dateInNewTimezone;
}

function uclFetchFunction() {
  return fetch("https://api.football-data.org/v2/competitions/CL/matches", {
    headers: { "X-Auth-Token": football_x_auth_token },
    url: "https://api.football-data.org/v2/competitions/CL/matches",
    dataType: "json",
    type: "GET",
  }).then((res) => res.json());
}
function displayVibeCheckers(message) {
  //vibeCheckers <---- this is an array containing the people who vibechecked

  if (vibeCheckers.length == 0) {
    message.channel.send("No one vibechecked in the given time :( ");
    return;
  }
  var replyString = "Good vibes:\n";
  vibeCheckers.forEach((person) => {
    replyString += `${person.Name}\t\t\t${person.Score}pts\n`;
  });
  console.log(replyString);
  message.channel.send(replyString);
}


function registerEachVibinScore(message) {
  var currentDate = new Date();
  var vibinScoreObj = {
    viberId: message.author.id, //id

    person: new Person( //person
      message.author.username.toString(), //name
      elapsedTimeForScore(), // score from window
      message.author.id // user id
    ),

    timeOfEntry: currentDate.toString(),
    vibinScore: elapsedTimeForScore(), //score
  };
}

function registerVibecheck(message) {

  const username = message.author.username.toString();
  var person1 = new Person(
    message.author.username.toString(),
    elapsedTimeForScore(),
    message.author.username.id
  );

  function checkAvailability(vibecheckers, username) {
    return vibecheckers.some((person) => person.Name === username);
  }

  personExists = checkAvailability(vibeCheckers, username);

  if (!personExists) {
    vibeCheckers.push(person1);
  }
}

/*
	Return Promise with Priemier League Table Top Teams
*/
function plTableCommandFunction() {
  return fetch("http://api.football-data.org/v2/competitions/2021/standings", {
    headers: { "X-Auth-Token": football_x_auth_token },
    url: "https://api.football-data.org/v2/competitions/CL/matches",
    dataType: "json",
    type: "GET",
  })
    .then((res) => res.json())
    .then((response) => {
      var printArray = [];
      var printString = "";
      var count = 10; // Max num of top teams to be displayed

      printArray.push("\tTeam\t\t\tPlayed | Pts");
      for (var i = 0; i < count; i++) {
        printString = `${response.standings[0].table[i].position}:${response.standings[0].table[i].team.name}`;

        printString += "\t\t";
        if (response.standings[0].table[i].team.name.length < 14) {
          printString += "\t";
        }
        printString += `${response.standings[0].table[i].playedGames} | ${response.standings[0].table[i].points}`;

        printArray.push(printString);
      }
      return printArray.join("\n");
    });
}
