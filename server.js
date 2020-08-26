const express   = require('express');
const http      = require('http')
const WebSocket = require('ws');
const router    = new express();
const server    = http.createServer(router);
const wsServer  = new WebSocket.Server({ server });
const uuid      = require('uuid/v4');

let STR = []

router.use(express.static('./dist'))

wsServer.on('connection', function (client) {

  console.log("connected")

  if(!Boolean(client.id)) { client.id = uuid(); }

  client.on('message', (e) => {
    const msg = JSON.parse(e);
    if(msg.action == 'insert') {
      STR.push(msg.data);
    } else {
      STR.pop()
    }

    wsServer.clients.forEach( r => {
      r.send(STR.join(''));
    }) 
  });

  wsServer.clients.forEach(r => {
    r.send(STR.join(''));
  }) 
  
  client.on('close', () => {
    console.log('close')
  });

});

server.listen(3000)
