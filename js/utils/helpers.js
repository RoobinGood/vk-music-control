define('helpers', [
	'underscore',
], function(_) {

	var cloneObject = function(object) {
		return JSON.parse(JSON.stringify(object));
	};

	var randomGUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	};

	var findDataIndex = function(data, element) {
		var titleId = $(element).closest(".seriesItem").data("id");
		return data.seriesData.findIndex(function(el) {
			return el.id === titleId;
		});
	};

	var showNotification = function(title, message) {
		chrome.notifications.create("new_series_" + Math.ceil(Math.random()*100500).toString(), {
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
	        }, 1005000);
	    });
	};

	var getTime = function() {
		return (new Date()).toTimeString().split(" ")[0];
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

	var indexOf = function(list, callback) {
		var index = -1;
		list && list.forEach(function(item, i) {
			if (index === -1  &&  callback  &&  callback(item)) {
				index = i;
			}
		});
		return index;
	};

	return {
		randomGUID: randomGUID,
		findDataIndex: findDataIndex,
		showNotification: showNotification,
		cloneObject: cloneObject,
		getTime: getTime,
		formatString: formatString,
		indexOf: indexOf,
	};
});