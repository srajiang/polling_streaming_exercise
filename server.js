
/* ------------------------------------------------------------------ SETUP */

const express = require('express');  // express server
const expressWs = require('express-ws');  // module that allows you to define websocket endpoints like any other express route

const app = express(); // Creates an express application

/* sets up express-ws on the specified app modifying the Router prototype ----- 
 https://www.npmjs.com/package/express-ws */
expressWs(app);  

/* in-mem storage for messages */
const messages = [{id: 0, text: 'Welcome', username: 'Chat Room'}];
const sockets = []; /* stores all the active Socket objects */


/* express.json returns a middleware functio that parses incoming requests with 
 JSON payloads. App.use binds it to the instance of the express application */
app.use(express.json()); 

/* set the express app to listen on port */
app.listen(3001, () => {
  console.log('Listening on port 3001');
})

/* ------------------------------------------------------------------ ROUTES */
app.get('/messages', (req, res) => {
  res.json(messages); //sends response with the messages object + content type set to JSON
});

app.post('/messages', (req, res) => { 
  const message = req.body;  // gets the post with the request message body
  messages.push(message);    // adds that message to messages
  for (const socket of sockets) {  // loops through all the sockets in sockets and .sends the JSON stringified  message to each
    socket.send(JSON.stringify(message));
  }
});

app.ws('/messages', socket => {  //defines a websocket route on messages that takes a socket and pushes it to sockets
  sockets.push(socket);
  socket.on('close', () => {  //listens for a close event an removes it from the sockets list
    sockets.splice(sockets.indexOf(socket), 1);
  })
})