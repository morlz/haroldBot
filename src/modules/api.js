const express = require('express')
const app = express()
const server = require('http').createServer(app);
const log = require("./log.js")
const options = require("./options.js")
const http = require('http')
const io = require('socket.io')(server)
const request = require('request')

'use strict'

let api = (function() {
    var instance;

	var connections = [],
		musicPlayer,
		client

	function handleMusicPlayerEvents () {
		musicPlayer.on("npChange", data => {
			io.sockets.emit("nowPlayingChange", data)
		})

		musicPlayer.on("pauseStateChange", data => {
			io.sockets.emit("pauseStateChange", data)
		})

		musicPlayer.on("queueChange", data => {
			let socketCon = connections.filter(el => el.uid == data.id)
			if (!socketCon.length) return

			let socket = socketCon[0].socket
			if (socket) {
				socket.emit("queueChange", data.queue.getAll())
			}
		})

		musicPlayer.on("playListChange", data => {
			let socketCon = connections.filter(el => el.uid == data.id)[0]
			if (!socketCon) return

			let socket = socketCon.socket
			if (socket) {
				data.queue.playList.getAll().then(playList => {
					socket.emit("playListChange", playList.data)
				})
			}
		})
	}

	function init () {
		io.on("connection", socket => {
			log(`[api] new connection ${socket.id}`)

			setTimeout(() => {
				socket.emit("getUID")
			}, 300)

			socket.on('disconnect', data => {
				let user = connections.filter((el, id) => {
					if (el.id == socket.id) return connections.splice(id, 1)
				})[0]
				log(`[api] <@${user ? user.uid : 'no authorized'}> disconnected ${socket.id}`);
			});

			socket.on("UID", data => {
				if (connections.filter(el => el.uid == data).length) {
					connections.map(el => {
						el.uid = data
						el.socket = socket
					})
				} else {
					connections.push({
						socket: socket,
						uid: data
					})
				}

				log(`[api] bind UID ${data} to socket ${socket.id}`)
			})

			socket.on("getAll", data => {
				let cache = {
					users: [],
					nowPlaying: musicPlayer.np,
					onPause: musicPlayer.pause,
					volume: musicPlayer.volume
				}

				let plPromises = []

				musicPlayer.allQueues().map((user, id) => {
					plPromises.push( user.queue.playList.getAll() )
					cache.users.push({
						name: user.name,
						id: id,
						queue: user.queue.getAll()
					})
				})

				Promise.all( plPromises ).then(pls => {
					return new Promise((resolve) => {
						pls.map((pl, id) => {
							cache.users[id].playList = pl.data
						})
						resolve()
					})
				}).then( () => {
					socket.emit("all", cache)
				} )
			})

			socket.on("skip", data => {
				log("[api] try to skip from " + data.userId)
				let dispatcher = client.voiceConnections.filter((el, id) => id == options.guildId).first().dispatcher
				if (dispatcher) dispatcher.end("skip")
			})

			socket.on("add", data => {
				let min = 0,
					max = 100

				if (data.count > min && data.count <= max) {
					log(`[api] added ${data.count} random items from playlist to ${data.userId}`)
					musicPlayer.add(data.userId, data.count)
				} else {
					log(`[api] not added ${data.count} random items from playlist to ${data.userId}`)
				}
			})

			socket.on("pauseStateChange", data => {
				musicPlayer.pause = !!data.newState
				log(`[api] set pause to ${data.newState} by ${data.userId}`)
			})

			socket.on("volumeChanged", data => {
				if (data.newValue < 0 || data.newValue > 100) return
				musicPlayer.volume = data.newValue
				socket.broadcast.emit("volumeChange", data.newValue)
			})

			socket.on("clearQueue", data => {
				let user = musicPlayer.allQueues().find("id", data.userId)
				if (user) {
					log(`[api] removed all queue for user ${data.userId}`)
					user.queue.remove("all")
				}
			})

			socket.on("removeFromQueue", data => {
				let user = musicPlayer.allQueues().find("id", data.userId)
				if (user) {
					log(`[api] removed ${data.index} from queue for user ${data.userId}`)
					user.queue.remove(data.index)
				}
			})

			socket.on("removeFromPlayList", data => {
				let user = musicPlayer.allQueues().find("id", data.userId)
				if (user) {
					log(`[api] removed ${data.index} from playList for user ${data.userId}`)
					user.queue.playList.remove(data.index)
				}
			})

			socket.on("removeSelectedFromPlayList", data => {
				let user = musicPlayer.allQueues().find("id", data.userId)
				if (user && data.ids) {
					log(`[api] removed ${data.ids.length} items from playList for user ${data.userId}`)
					user.queue.playList.remove(data.ids)
				}
			})

			socket.on("addFromPlayListInQueue", data => {
				let user = musicPlayer.allQueues().find("id", data.userId)
				if (user) {
					log(`[api] added ${data.index} from playList in queue for user ${data.userId}`)
					user.queue.playList.get(data.index)
						.then(audio => {
							user.queue.add(audio)
						})
				}
			})

			socket.on("addSelectedFromPlaylistInQueue", data => {
				let user = musicPlayer.allQueues().find("id", data.userId)
				if (user && data.ids) {
					log(`[api] added ${data.ids.length} items from playList in queue for user ${data.userId}`)
					data.ids.map(el => {
						user.queue.playList.get(el)
							.then(audio => {
								user.queue.add(audio)
							})
					})

				}
			})

		})

		server.listen(2303);

		log(`[api] init`)

		return {
			bind: (c, mp) => {
				client = c
				musicPlayer = mp
				handleMusicPlayerEvents()
			},
			register: (ip, guildId) => {
				let postData = {
					type: "update",
					ip: ip,
					guildId: guildId
				}

				let url = "http://pew-pc.com/harold/index.php?"

				for (var t in postData) {
					if (postData.hasOwnProperty(t)) {
						url += `${t}=${postData[t]}&`
					}
				}

				request.get(url, (err, res, body) => {
					if (err || body == 1) {
						log("[api] cannot register. " + err || body)
					} else if (body == "0"){
						log(`[api] registred`)
					}
				})
			}
		}
	}

    return {
        getInstance: function() {
            if (!instance) {
                instance = init()
            }
            return instance
        }
    }
})();



module.exports = api.getInstance()
