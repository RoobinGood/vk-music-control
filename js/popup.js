require([
	'helpers',
], function(Helpers) {

	// redirect to audible vk tab or vk tab with player or to new vk tab
	Helpers.getCurrentTab(function(tabId) {
		if (tabId) {
			console.log('redirect to', tabId);
			chrome.tabs.update(tabId, {selected: true});
		} else {
			chrome.tabs.create({
				url: 'https://new.vk.com/'
			});
		}
	});

});