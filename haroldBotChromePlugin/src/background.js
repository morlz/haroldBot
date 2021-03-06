var loadedUrl = [],
	songNames = [],
	serverIp


chrome.storage.sync.get(["serverIp"], data => {
	serverIp = data.serverIp
})

function load (url) {
	return new Promise((resolve) => {
		if (loadedUrl.indexOf(url) + 1) return
		loadedUrl.push(url)

		console.log("catched url: ", url);

		let req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.responseType = 'blob';

		req.onload = function() {
			if (this.status === 200) {
				var blob = this.response;
				console.log("loaded file", (blob.size / 1024 / 1024).toFixed(2) , "mb");
				resolve({
					blob: blob,
					urlIndex: loadedUrl.indexOf(url)
				})
			}
		}

		req.send();
	})
}

function getName(data, i = 0) {
	console.log("try to get name", songNames, data.urlIndex);
	return new Promise((resolve, reject) => {
		if (songNames[data.urlIndex]) {
			console.log("name geted", songNames[data.urlIndex])
			resolve({
				blob: data.blob,
				fileName: songNames[data.urlIndex],
				urlIndex: data.urlIndex
			})
		} else {
			setTimeout(() => {
				if (i < 10) {
					getName(data, i + 1)
						.then(resolve)
						.catch(reject)
				} else reject ()
			}, 100)
		}
	})
}

function flushMemory() {
	return new Promise((resolve) => {
		if (loadedUrl.length != songNames.length) {
			console.log("flushing memory");
			if (!songNames.length || loadedUrl.length) {
				loadedUrl = []
				songNames = []
			} else {
				loadedUrl = [ loadedUrl[loadedUrl.length - 1] ]
				songNames = [ songNames[songNames.length - 1] ]
			}
		}
		resolve()
	})
}

function uploadBlob(data){
	console.log("try to send data");
	var formData = new FormData()
	formData.append('kek', data.blob, data.fileName + '.mp3')
	getUserId()
		.then(userId => {
			return new Promise((resolve) => {
				formData.append('userId', userId)
				resolve(formData)
			})
		})
		.then(formData => {
			if (!serverIp) {
				console.warn("not send, no server ip")
				return
			}
			$.ajax({
				url: `http://${serverIp}:80/`,
				data: formData,
				type: 'POST',
				contentType: false,
				processData: false,
				success: function (res) {
					clear(data.urlIndex)
					console.log("sended, server responce:", res);
				},
				error: function (res) {
					clear(data.urlIndex)
					console.warn("error, server responce:", res);
				}
			});
		})
}

function clear(id) {
	loadedUrl.splice(id, 1)
	songNames.splice(id, 1)
	flushMemory()
}

var filter = {
	urls: ["https://*.vk-cdn.net/*", "https://*.userapi.com/*/audios/*", "https://*.userapi.com/*.mp3?extra=*"]
}

chrome.webRequest.onSendHeaders.addListener(data => {
	load (data.url)
		.then(getName)
		.then(uploadBlob)
		.catch(flushMemory)
}, filter, ["requestHeaders"])

chrome.storage.onChanged.addListener((data, area) => {
	if (data.serverIp && data.serverIp.newValue) {
		serverIp = data.serverIp.newValue
	}
	if (data.lastSongName && data.lastSongName.newValue) {
		console.log("geted song name", data.lastSongName.newValue);
		songNames.push(data.lastSongName.newValue)
	}
})

//chrome.webRequest.onHeadersReceived.addListener(, filter, ["responseHeaders"])

var createdTabIndex = false

function getUserId(){
	return new Promise((resolve) => {
		chrome.storage.sync.get(["userId"], (data) => {
			if (!data.userId) {
				if (!createdTabIndex) {
					chrome.tabs.create({
						active: true,
						url: "https://discordapp.com/channels/345551217918738432"
					}, tab => {
						console.log("tab created with id", tab.index);
						createdTabIndex = tab.index
						setTimeout(() => {
							getUserId().then(resolve)
						}, 1000)
					})
				} else {
					setTimeout(() => {
						getUserId().then(resolve)
					}, 1000)
				}
			} else {
				resolve(data.userId)
			}
		})
	})
}

getUserId().then(userId => {
	console.log(userId)
})

/*
class App {
	constructor(options){
		var _self = this

		this.songNames = []
		this.catchedUrls = []
	}

	async init (data) {
		if (!data.userId) {
			data.userId = await this.getUid()
		}
		this.userId = data.userId
		this._refreshSocket(data.serverIp)
		return console.log("init")
	}

	async getUid () {
		var _self = this
		if (_self.createdTabIndex) {
			setTimeout(() => {
				return _self.getUid()
			}, 1000)
		} else {
			_self._createDiscordTab()
		}
	}

	async _createDiscordTab () {
		var _self = this
		chrome.tabs.create({
			active: true,
			url: "https://discordapp.com/channels/345551217918738432"
		}, tab => {
			console.log("tab created with id", tab.index);

			createdTabIndex = tab.index
			setTimeout(() => {
				getUserId().then(resolve)
			}, 1000)
		})
	}

	catchRequest (data) {

	}

	storageChanged (data, area) {
		if (data.serverIp && data.serverIp.newValue) {
			this._refreshSocket(data.serverIp.newValue)
		}

		if (data.lastSongName && data.lastSongName.newValue) {
			console.log("geted song name", data.lastSongName.newValue);
			this.songNames.push(data.lastSongName.newValue)
		}
	}

	_refreshSocket (newIp) {
		if (this.socket) this.socket.disconnect()
		if (this.ip == newIp) return this.socket

		this.ip = newIp
		this.socket = io(`http://${newIp}:2302/`)

		return this.socket
	}
}

*/


//let filter = {urls: ["https://*.vk-cdn.net/*", "https://*.userapi.com/*/audios/*", "https://*.userapi.com/*.mp3?extra=*"]}

/*
var app = new App()

$(async function () {


	chrome.storage.sync.get(["serverIp", "userId"], app.init)

	chrome.webRequest.onSendHeaders.addListener(app.catchRequest, filter, ["requestHeaders"])
	chrome.storage.onChanged.addListener(app.storageChanged)
})
*/
