define('helpers', [
	'underscore',
], function(_) {

	var randomGUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	};

	/**
	 * String formatter to substitute data to pattern string.
	 * Use `{keyName}` to insert data from parameters.
	 */
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
		randomGUID: randomGUID,
		formatString: formatString
	};
});