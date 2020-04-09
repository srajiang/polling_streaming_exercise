const axios = require('axios');
const WebSocket = require('ws'); // a nodejs Websocket library -- https://www.npmjs.com/package/ws

/* creates a new Websocket object, passing in a URL */
function createMessagingSocket() {
  return new WebSocket('ws://localhost:3001/messages');
}

/* makes an axios get request to URI endpoint and returns the result data */
function getMessages() {
  return axios.get('http://localhost:3001/messages').then(res => res.data);
}

/* makes an axios post request to the endpoint with the message body */
function sendMessage(message) {
  return axios.post('http://localhost:3001/messages', message);
}

module.exports.createMessagingSocket = createMessagingSocket;
module.exports.getMessages = getMessages;
module.exports.sendMessage = sendMessage;