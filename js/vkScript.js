// player
var Player = function() {
	this.buttons = {
		play: 'top_audio_player_play',
		prev: 'top_audio_player_prev',
		next: 'top_audio_player_next'
	};

	this.clickButton = function(button) {
		if (!this.buttons[button]) {
			throw new Error('There is now such button:', button);
		}

		var buttonEls = document.getElementsByClassName(this.buttons[button]);
		if (buttonEls && buttonEls.length) {
			buttonEls[0].click();
		} else {
			console.log('Button', button, 'unavailable');
		}
	};

	this.execute = function(command) {
		this.clickButton(command);
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
		console.log('receive:', request.command);

		if (request.command === 'info') {
			sendResponse({
				command: 'info',
				type: 'response',
				data: player.getTrack()
			});
		} else {
			player.execute(request.command);
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
					data: track
				}
			);

			console.log(track);
			currentTrack = track;
		}
	}, 300);
};
