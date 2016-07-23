define('helpers', [
	'underscore',
], function(_) {

	var sendCommand = function(command, mainCallback) {
		mainCallback = mainCallback || _.noop;

		var wrongTabs = [];
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
		var sendMessageToCurrentTab = function(callback) {
			getCurrentTab({
				filter: function(item) {
					return wrongTabs.indexOf(item.id) === -1;
				}
			}, function(tabId) {
				if (!tabId) {
					return callback(null);
				}

				sendMessage({
					id: tabId,
					command: command
				}, function(response) {
					// console.log(tabId, response);

					if (response.data.result) {
						callback(response);
					} else {
						wrongTabs.push(tabId);
						sendMessageToCurrentTab(callback);
					} 
				});
			});
		};

		sendMessageToCurrentTab(mainCallback);
	};

	var getCurrentTab = function(params, callback) {
		if (!callback) {
			callback = params;
			params = undefined;
		}

		params = params || {};
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
					if (params.filter) {
						tabs = tabs.filter(params.filter);
					}

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