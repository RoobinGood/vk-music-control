require([
	'underscore', 'helpers'
], function(_, helpers) {

	console.log("background script");

	var sendCommand = function(command, callback) {
		callback = callback || _.noop();

		chrome.tabs.query({
			url: 'https://new.vk.com/*'
		}, function(tabs) {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{
					command: command,
					type: 'request'
				},
				callback
			);
		});
	};

	var defaultCommandHandler = function(command) {
		sendCommand(command)
	};

	var commands = {
		play: defaultCommandHandler,
		next: defaultCommandHandler,
		prev: defaultCommandHandler,
		info: function(command) {
			sendCommand(command, function(response) {
				helpers.showNotification(
					response.data.artist, response.data.track
				);
			});
		}
	};

	chrome.commands.onCommand.addListener(function(command) {
		console.log('execute:', command);
		commands[command](command);
	});

});