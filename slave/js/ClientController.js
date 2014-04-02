
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
	addClient: function (parent, id, color) {

		var client = new Instrument(parent, color);
		this.clients[id] = client;
		this.numClients++;

		return client;
	},

	/**
	 * Get a client by its socket ID
	 */
	getClientById: function (id) {

		return this.clients[id];
	},

	/**
	 * Execute a command on a specific client
	 */
	execute: function (clientId, command) {

		var client = this.getClientById(clientId);

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
		}
	},

	/**
	 * Destroy a specific client 
	 */
	destroyClient: function (id) {

		var client = this.getClientById(id);

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