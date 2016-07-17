require([
	'underscore', 'notificationManager'
], function(_, NotificationManager) {

	console.log("background script");

	var sendCommand = function(command, callback) {
		callback = callback || _.noop();
		var targetUrl = 'https://new.vk.com/*';
		var sendMessage = function(params, callback) {
			chrome.tabs.sendMessage(
				params.id,
				{
					command: params.command,
					type: 'request'
				},
				callback
			);
		};

		// search vk tab with playing music
		chrome.tabs.query({
			url: targetUrl,
			audible: true
		}, function(tabs) {
			if (tabs && tabs.length) {
				// if there is playing vk tab
				sendMessage({
					id: tabs[0].id,
					command: command
				}, callback);
			} else {
				// search any vk tab
				chrome.tabs.query({
					url: targetUrl
				}, function(tabs) {
					if (!tabs || tabs.length === 0) {
						return callback();
					}

					sendMessage({
						id: tabs[0].id,
						command: command
					}, callback);
				});
			}
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
				NotificationManager.show({
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

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log('receive:', request.command);

			if (request.command === 'info') {
				NotificationManager.show({
					title: request.data.artist,
					message: request.data.track
				});
			}
		}
	);

});