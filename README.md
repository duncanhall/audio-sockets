Audio Sockets
===============

A collaborative music experiment using your webbrowser as an instrument.

###Requirements

[node](http://nodejs.org/) and [npm](https://www.npmjs.org/) - To run the socket server  

###Dependencies

[socket.io](http://socket.io/)  
[express](http://expressjs.com/)  

Installed via `npm install`

[audiosynth](https://github.com/keithwhor/audiosynth/)

Installed via:

`git submodule init`  
`git submodule update`

###Install

`node server/server.js`

This will launch a socket server listening for connections on port 8000 on the current machine. It will also begin serving the client and slave pages from the same address.

Browse to `http://127.0.0.1:8000` for the client page.  
Browse to `http://127.0.0.1:8000/slave.html` for the slave page.  
