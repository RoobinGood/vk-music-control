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
		console.log(this.buttons[button]);
		var buttonEls = document.getElementsByClassName(this.buttons[button]);
		if (buttonEls && buttonEls.length) {
			buttonEls[0].click();
		}
	};

	this.execute = function(command) {
		this.clickButton(command);
	};
};

// init
var player = new Player();

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		player.execute(request.command);
	}
);