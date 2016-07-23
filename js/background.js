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
				console.log('info response', response);
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
			console.log('receive:', request.type, request.command);

			if (request.command === 'info') {
				notificationManager.show({
					title: request.data.artist,
					message: request.data.track
				});
			} else if (request.command === 'getTabInfo') {
				sendResponse({
					command: 'getTabInfo',
					type: 'response',
					data: {
						info: sender.tab
					}
				});
			} 
		}
	);


	// handle notification click
	chrome.notifications.onClicked.addListener(function() {
		helpers.getCurrentTab(function(tabId) {
			console.log('redirect to', tabId);
			chrome.tabs.update(tabId, {selected: true});
		});
	});
});