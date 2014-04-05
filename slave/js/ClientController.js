
var ClientController = Class.extend({
	

	init: function () {

		this.numClients = 0;
		this.numActive = 0;
		this.clients = [];
	},

	/**
	 * 
	 */
	hasActiveClients: function () {

		return this.numActive > 0;
	},

	/**
	 * Create a new client Instrument and associate it with
	 * its socket ID.
	 */ 
	add: function (parent, id, color) {

		var client = new Instrument(parent, color);
		this.clients[id] = client;
		this.numClients++;

		return client;
	},

	/**
	 * Get a client by its socket ID
	 */
	get: function (id) {

		return this.clients[id];
	},

	/**
	 * Execute a command on a specific client
	 */
	execute: function (clientId, command, data) {

		var client = this.get(clientId);

		switch(command) 
		{
			case ClientController.START:
				this.numActive++;
				client.start();
				break;

			case ClientController.STOP:
				this.numActive--;
				client.stop();
				break;

			case ClientController.CHANGE:
				client.octave = (data.y - 3) * -1;
				break;				
		}
	},

	/**
	 * Destroy a specific client 
	 */
	destroy: function (id) {

		var client = this.get(id);

		if (client != null)
		{
			client.destroy();
			this.numClients--;
			this.clients[id] = null;
			delete this.clients[id];			
		}
	}

});

ClientController.START = 'as:start';
ClientController.STOP = 'as:stop';
ClientController.CHANGE = 'as:change';
