
var Controller = Class.extend({
	

	init: function () {

		this.numClients = 0;
		this.clients = [];
	},

	/**
	 * Create a new client of Type and associate it with
	 * its socket ID.
	 */ 
	addClient: function (parent, Type, id) {

		var client = new Type(parent);
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
			case Controller.START:
				client.start();
				break;

			case Controller.STOP:
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

Controller.START = 'as:start';
Controller.STOP = 'as:stop';