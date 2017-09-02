const options = require("./options.js")
const UserQueue = require("./UserQueue.js")
const log = require("./log.js")
const path = require("path")
const fs = require("fs")
const ytdl = require('ytdl-core');
const util = require('util');
const { EventEmitter } = require("events")

class MusicPlayer extends EventEmitter {
	constructor(){
		super();
		this.users = []
		this.nowPlaying = false;
		this.vol = 10
		this.on("playEnd", () => {
			this.pause = false
			this.emit("pauseStateChange", false)
			this.play()
		})
	}

	init (client) {
		this.client = client
	}

	allQueues () {
		return this.users
	}

	get np () {
		return this.nowPlaying
	}

	set np (newState) {
		this.nowPlaying = newState
		this.emit("npChange", newState)
	}

	get pause() {
		let voiceConnection = this.client.voiceConnections
			.filter((el, id) => id == options.guildId)
			.first()
		if (!voiceConnection || !voiceConnection.dispatcher) return false
		return voiceConnection.dispatcher.paused
	}

	get volume () {
		return this.vol
	}

	set volume (newValue) {
		this.emit("volumeChange", newValue)
		this.vol = newValue
		let voiceConnection = this.client.voiceConnections
			.filter((el, id) => id == options.guildId)
			.first()
		if (!voiceConnection || !voiceConnection.dispatcher) return
		voiceConnection.dispatcher.setVolume(newValue / 100)
	}

	set pause(newState){
		if (newState != this.pause) {
			let voiceConnection = this.client.voiceConnections
				.filter((el, id) => id == options.guildId)
				.first()

			if (!voiceConnection || !voiceConnection.dispatcher) return
			let dispatcher = voiceConnection.dispatcher

			if (newState) {
				dispatcher.pause()
				log(`[musicPlayer] paused`)
			} else {
				dispatcher.resume()
				log(`[musicPlayer] resumed`)
			}

			this.emit("pauseStateChange", newState)
		}
	}

	add (member, count) {
		member = this.users.find("id", member.id || member)
		for (let i = 0; i < count; i++) {
			member.queue.addFromPlayList()
		}
	}

	play () {
		var _self = this

		var _filterUsers = async users => {
			return users.filter(el => el ? el : false)
		}

		var _checkUsersCount = users => {
			return new Promise((resolve, reject) => {
				if (users.length) {
					log(`[musicPlayer] ${users.length} users geted`)
					resolve(users)
				} else {
					reject('no users with songs')
				}
			})
		}

		var _getRandomUser = async users => {
			return new Promise((resolve, reject) => {
				let randomUserId = Math.round( Math.random() * ( users.length - 1 ) )
				let randomUser = users[ randomUserId ]
				if (!randomUser) reject ('invalid user')
				log(`[musicPlayer] selected ${randomUser}`)
				resolve(randomUser)
			})
		}

		var _getAudio = async randomUser => {
			return {
				user: randomUser,
				audio: await randomUser.queue.getThis()
			}
		}

		var _selectPlayerAndPlay = data => {
			let _playUrl = url => {
				return new Promise((resolve, reject) => {
					_self.np = data
					_self.pause = false

					let stream = ytdl(url, { filter : 'audioonly' });

					const streamOptions = { seek: 0, volume: _self.vol / 100 };
					let dispatcher = _self.client.voiceConnections
						.filter((el, id) => id == options.guildId)
						.first()
						.playStream(stream, streamOptions)

					dispatcher.on("error", reject)

					dispatcher.on("start", () => {
						log(`[musicPlayer] start playing stream ${data.fileName}`)
					})
					dispatcher.on("end", () => {
						log(`[musicPlayer] end playing stream ${data.fileName}`)
						_self.np = false
						resolve()
					})
				})
			}

			let _playFile = data => {
				return new Promise((resolve, reject) => {
					_self.np = data

					let filePath = path.join(__dirname, options.folders.cache, data.userId, data.fileName)
					let dispatcher = _self.client.voiceConnections
						.filter((el, id) => id == options.guildId)
						.first()
						.playFile(filePath, { volume: _self.vol / 100 })

					dispatcher.on("error", reject)

					dispatcher.on("start", () => {
						log(`[musicPlayer] start playing file ${data.fileName}`)
					})

					dispatcher.on("end", () => {
						log(`[musicPlayer] end playing file ${data.fileName}`)
						_self.np = false
						resolve()
					})

				})
			}

			/*
			let _play = (audio) => {
				return new Promise((resolve, reject) => {
					_self.np = data
					_self.pause = false

					let voiceConnection = _self.client.voiceConnections
						.filter((el, id) => id == options.guildId)
						.first()

					var dispatcher;

					if (data.audio.local) {
						let filePath = path.join(__dirname, options.folders.cache, audio.data.userId, audio.data.fileName)
						dispatcher = voiceConnection.playFile(filePath, { volume: _self.vol / 100 })
					} else {
						const streamOptions = { seek: 0, volume: _self.vol / 100 };
						let stream = ytdl(url, { filter : 'audioonly' });
						dispatcher = voiceConnection.playStream(stream, streamOptions)
					}

					dispatcher.on("error", reject)

					dispatcher.on("start", () => {
						log(`[musicPlayer] start playing file ${audio.data.fileName}`)
					})

					dispatcher.on("end", () => {
						log(`[musicPlayer] end playing file ${audio.data.fileName}`)
						_self.np = false
						resolve()
					})

				})
			}
			*/

			return new Promise((resolve, reject) => {
				log(`[musicPlayer] audio geted ${ data.audio.fileName }`)
				var player;
				if (data.audio.local) {
					// playing from a fule from plugin
					player = _playFile
				} else {
					//playing from url
					player = _playUrl
				}
				data.user.queue.skip()
				player(data.audio)
					.then(resolve)
					.catch(reject)
			})
		}

		log(`[musicPlayer] waiting for song`)
		if (_self.np) {
			return
		}
		_self.getUsers()
			.then(_filterUsers)
			.then(_checkUsersCount)
			.then(_getRandomUser)
			.then(_getAudio)
			.then(_selectPlayerAndPlay)
			.then(() => {
				setTimeout (() => {
					_self.emit("playEnd")
				}, 1000)
			}) // play next
			.catch(reason => {
				//console.trace(reason)
				log(`[musicPlayer] not playing because: ${reason}, next try after 5s` )
				setTimeout (() => {
					_self.emit("playEnd")
				}, 5000)
			})
	}

	addLocal (data) {
		var _self = this
		data.local = true
		if (_self.users && !Array.isArray(_self.users)) {
			let user = _self.users.find("id", data.userId)
			if (user) {
				user.queue.add(data)
			} else {
				log(`[musicPlayer] Audio not added, user <@${data.userId}> not in voice channel with bot`)
			}
		}
	}

	async refresh () {
		var _self = this

		var _updateUsers = async () => {
			_self.client.voiceConnections.map((el, id) => {
				if (id == options.guildId) {
					_self.users = el.channel.members
				}
			})
			log("[musicPlayer] update users")
		}

		var _updateQueues = async () => {
			_self.users.map((user) => {
				if (!user.queue) {
					user.queue = new UserQueue(user)

					user.queue.on("changed", data => {
						_self.emit("queueChange", user)
					})

					user.queue.playList.on("playListChange", data => {
						_self.emit("playListChange", user)
					})
				}
			})
			log("[musicPlayer] update queues")
		}

		log("[musicPlayer] refresh")
		await _updateUsers()
		await _updateQueues()
	}

	async getUsers () {
		//return only users (no bots) with non zero length queue
		log("[musicPlayer] get users with queues ");
		let users = this.users.array().filter(user => user.queue.haveItems)
		return users
	}
}

module.exports = new MusicPlayer()
