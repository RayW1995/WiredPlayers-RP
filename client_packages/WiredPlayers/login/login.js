﻿mp.events.add('accountLoginForm', (hours, minutes, seconds) => {
	// Set the hour from the server
	mp.game.time.setClockTime(hours, minutes, seconds);
	
	// Create login window
	mp.events.call('createBrowser', ['package://WiredPlayers/statics/html/accountLogin.html']);
});

mp.events.add('requestPlayerLogin', (password) => {
	// Check for the credentials
	mp.events.callRemote('loginAccount', password);
});

mp.events.add('showLoginError', () => {
});

mp.events.add('clearLoginWindow', () => {
	// Unfreeze the player
	mp.players.local.freezePosition(false);
	
	// Destroy the login window
	mp.events.call('destroyBrowser');
});