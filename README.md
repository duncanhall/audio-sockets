Audio Sockets
===============

A collaborative music experiment using your webbrowser as an instrument.

###Requirements

[node](http://nodejs.org/) and [npm](https://www.npmjs.org/) - To run the socket server  

###Dependencies

[audiosynth](https://github.com/keithwhor/audiosynth/) - Dynamic waveform audio synthesizer, written in Javascript.  
[socket.io](http://socket.io/) - Realtime application framework for Node.JS  
[express](http://expressjs.com/) - Web application framework for node

###Installation
	
Install the dependencies for the server and clone the audiosynth submodule for playback:

	npm install
    git submodule init
    git submodule update

Run the server:

`node server/server.js`

This will launch a socket server listening for connections on port 8000 on the current machine. It will also begin serving the client and slave pages from the same address.

Browse to `http://127.0.0.1:8000` for the client page.  
Browse to `http://127.0.0.1:8000/slave.html` for the slave page.  
