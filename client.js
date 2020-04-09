
const messagingAPI = require('./messaging_api'); //API functions for the client
const readline = require('readline'); // nodejs module for working with the console
const helpers = require('./helpers'); // helper func for getting a random integer

/* vars */
const displayedMessages = {}; 
const terminal = readline.createInterface({   // creates an instance of Interface which allows comms through stdin and out
  input: process.stdin
});

terminal.on('line', text => {
  const username = process.env.NAME;
  const id = helpers.getRandInt(100000000);
  displayedMessages[id] = true; /* sets the id of that message to displayed as true */

  const message = { id, text, username };
  messagingAPI.sendMessage(message);
});

function displayMessage(message) {
  console.log(`> ${message.username}: ${message.text}`);
  displayedMessages[message.id] = true; /* sets the id of the message to be displayed as true */
}

async function getAndDisplayMessages() {
  const messages = await messagingAPI.getMessages(); // makes a get request to the server for all the messages 
  for( const message of messages) { // for every message in the response
    const messageAlreadyDisplayed = message.id in displayedMessages; // message.id will return T or F and stored as const
    if (!messageAlreadyDisplayed) displayMessage(message); 
  } 
}

function pollMessages() {
  setInterval(getAndDisplayMessages, 3000);
}

function streamMessages() {
  const messagingSocket = messagingAPI.createMessagingSocket();  //makes the messaging socket
  messagingSocket.on('message', data => {  //listens for a message event, then displays the message
    const message = JSON.parse(data);
    const messageAlreadyDisplayed = message.id in displayedMessages;
    if(!messageAlreadyDisplayed) displayMessage(message);
  })
}

if (process.env.MODE === 'poll') {
  getAndDisplayMessages();
  pollMessages();
} else if (process.env.MODE === 'stream') {
  getAndDisplayMessages();
  streamMessages();
}