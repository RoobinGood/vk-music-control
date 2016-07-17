require([
	'underscore', 'notificationManager', 'helpers'
], function(_, notificationManager, helpers) {

	console.log("background script");

	// handle hotkey commands
	var commands = {
		play: helpers.defaultCommandHandler,
		next: helpers.defaultCommandHandler,
		prev: helpers.defaultCommandHandler,
		info: function() {
			helpers.sendCommand('info', function(response) {
				console.log(response);
				if (!response.data) {
					return;
				}

				notificationManager.show({
					title: response.data.artist,
					message: response.data.track
				});
			});
		}
	};

	chrome.commands.onCommand.addListener(function(command) {
		console.log('execute:', command);
		commands[command](command);
	});


	// handle track change message from vk tab
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log('receive:', request.command);

			if (request.command === 'info') {
				notificationManager.show({
					title: request.data.artist,
					message: request.data.track
				});
			}
		}
	);

});