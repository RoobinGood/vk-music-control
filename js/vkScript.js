// player
var Player = function() {
	this.buttons = {
		play: 'top_audio_player_play',
		prev: 'top_audio_player_prev',
		next: 'top_audio_player_next'
	};

	this.clickButton = function(button, callback) {
		if (!this.buttons[button]) {
			return callback({
				error: 'Button is not exists',
				target: button
			});
		}

		var playerEl = document.getElementsByClassName('top_audio_player_enabled');

		if (!playerEl || !playerEl.length) {
			console.log('Player is unavailable');
			return callback({
				error: 'Player is unavailable'
			});
		}

		var buttonEls = document.getElementsByClassName(this.buttons[button]);
		if (!buttonEls || !buttonEls.length) {
			console.log('Button', button, 'unavailable');
			return callback({
				error: 'Button is unavailable',
				target: button
			});
		}

		buttonEls[0].click();
		callback();
	};

	this.execute = function(command, callback) {
		this.clickButton(command, callback);
	};

	this.getTrack = function() {
		var titleEls = document.getElementsByClassName('top_audio_player_title');

		if (!titleEls || !titleEls.length || !titleEls[0].textContent.length) {
			return null;
		}

		var title = titleEls[0].textContent;
		var separator = ' – ';

		var artist = title.split(separator)[0];
		var track = title.substr(artist.length + separator.length);

		return {
			artist: artist,
			track: track
		}
	}
};

// init
var player = new Player();

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log('receive:', request.type, request.command);

		if (request.command === 'info') {
			sendResponse({
				command: 'info',
				type: 'response',
				result: true,
				data: player.getTrack()
			});
		} else {
			player.execute(request.command, function(err) {
				sendResponse({
					command: request.command,
					type: 'response',
					result: !err
				});
			});
		}
	}
);

// watch over current track
window.onload = function() {
	var currentTrack = player.getTrack();

	setInterval(function() {
		var track = player.getTrack();
		if (track !== currentTrack && (
			currentTrack === null ||
			track.artist !== currentTrack.artist ||
			track.track !== currentTrack.track
		)) {
			chrome.runtime.sendMessage(
				chrome.runtime.id,
				{
					command: 'info',
					type: 'response',
					result: true,
					data: track
				}
			);

			// console.log(track);
			currentTrack = track;
		}
	}, 300);
};

console.info('vk-music-control started');
chrome.runtime.sendMessage(
	chrome.runtime.id,
	{
		command: 'getTabInfo',
		type: 'request'
	},
	function(response) {
		console.info('tab id', response.data.info.id);
	}
);