define('helpers', [
	'underscore',
], function(_) {

	var showNotification = function(title, message) {
		chrome.notifications.create("track_" + Math.ceil(Math.random()*100500).toString(), {
	        type: 'basic',
			iconUrl: 'static/icon.png',
	        title: title,
	        message: message,
	        priority: 1,
	        buttons: []
	    }, function(notificationId) {
	        setTimeout(function() {
	            chrome.notifications.clear(notificationId, function(wasCleared) {
	                console.log(wasCleared);
	            });
	        }, 5000);
	    });
	};

	var formatString = function(pattern, insertedData) {
		var resultString = pattern;
		_(pattern.match(/{[a-zA-Z\d\-\_\.]+}/g)).each(function(rawKey) {
			var key = rawKey.substr(1, rawKey.length-2);

			var rawKeyRegExp = new RegExp('\\{' + key + '\\}', 'g');
			if (insertedData[key] !== undefined) {
				resultString = resultString.replace(rawKeyRegExp, insertedData[key]);
			}
		});
		return resultString;
	};

	return {
		showNotification: showNotification,
		formatString: formatString
	};
});