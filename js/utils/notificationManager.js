define('notificationManager', [
	'underscore'
], function(_) {

	var NotificationManager = function() {
		var self = this;

		this.currentNotification = {
			id: null,
			data: null
		};

		this.defaultParams = {
			title: 'Unknown',
			message: 'Unknown',
			iconUrl: 'static/icon.png',
			duration: 5000
		};

		this.clear = function(callback) {
			callback = callback || _.noop;

			chrome.notifications.clear(
				this.currentNotification.id,
				function() {
					self.currentNotification.id = null;
					self.currentNotification.data = null;
					callback();
				}
			);
		};

		this.show = function(params, callback) {
			callback = callback || _.noop;

			_(params).defaults(this.defaultParams);

			if (_.isEqual(this.currentNotification.data,
				_(params).pick('title', 'message', 'iconUrl'))
			) {
				return callback(null);
			}

			if (this.currentNotification.id) {
				this.clear(function() {
					_create(params, callback);
				});
			} else {
				_create(params, callback);
			}
		};

		var _create = function(params, callback) {
			_(params).defaults({
				duration: this.duration
			});

			var notificationId = "notification_" +
				Math.ceil(Math.random()*100500).toString();

			var notificationParams = _.chain({
				type: 'basic',
				priority: 1,
				buttons: []
			}).extend(
				_(params).pick('title', 'message', 'iconUrl')
			).value();

			chrome.notifications.create(
				notificationId,
				notificationParams,
				function() {
					self.currentNotification.id = notificationId;
					self.currentNotification.data = _(notificationParams).pick(
						'title', 'message', 'iconUrl'
					);

					setTimeout(function() {
						if (self.currentNotification.id === notificationId) {
							self.clear();
						}
					}, params.duration);

					callback();
				}
			);
		};
	};

	// init singleton
	var NotificationManagerInstance = new NotificationManager();

	return NotificationManagerInstance;
});