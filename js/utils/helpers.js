define('helpers', [
	'underscore',
], function(_) {

	var sendCommand = function(command, callback) {
		callback = callback || _.noop();
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

		getCurrentTab(function(tabId) {
			if (!tabId) {
				return callback(null);
			}

			sendMessage({
				id: tabId,
				command: command
			}, callback);
		});
	};

	var getCurrentTab = function(callback) {
		callback = callback || _.noop;
		var targetUrl = 'https://new.vk.com/*';

		// search vk tab with playing music
		chrome.tabs.query({
			url: targetUrl,
			audible: true
		}, function(tabs) {
			if (tabs && tabs.length) {
				// if there is playing vk tab
				callback(tabs[0].id);
			} else {
				// search any vk tab
				chrome.tabs.query({
					url: targetUrl
				}, function(tabs) {
					if (!tabs || tabs.length === 0) {
						return callback(null);
					}

					callback(tabs[0].id);
				});
			}
		});
	};

	var defaultCommandHandler = function(command) {
		sendCommand(command);
	};

	return {
		sendCommand: sendCommand,
		defaultCommandHandler: defaultCommandHandler,
		getCurrentTab: getCurrentTab
	};
});