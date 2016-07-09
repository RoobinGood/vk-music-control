require([
	// dependencies
], function() {

	console.log("background script");

	var sendCommand = function(command) {
		chrome.tabs.query({
			url: 'https://new.vk.com/*'
		}, function(tabs) {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{ command: command }
			);
		});
	};

	chrome.commands.onCommand.addListener(function(command) {
		sendCommand(command);
	});

});