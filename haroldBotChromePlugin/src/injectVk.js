'use strict'

function createHandler(arr) {
	return e => {
		let val = e.target.innerHTML
		if (arr.indexOf(val) == -1 && val) {
			arr.push(val)
			composeSongName()
		}
	}
}

var performers = [],
	songs = [];

$('body')
	.on("DOMSubtreeModified", '.audio_page_player_title_performer', createHandler(performers) )
	.on("DOMSubtreeModified", '.audio_page_player_title_song', createHandler(songs) )

function sendName (name) {
	return new Promise((resolve) => {
		chrome.storage.sync.get("lastSongName", (data) => {
			if (data.lastSongName != name) {
				console.log("set last song name to", name);
				chrome.storage.sync.set({"lastSongName": name}, resolve)
			} else resolve()
		})
	})
}

function composeSongName () {
	if (performers[0] && songs[0]) {
		let songName = performers[0] + songs[0]
		sendName( songName )
			.then(() => {
				performers.shift()
				songs.shift()
			})
	}
}
