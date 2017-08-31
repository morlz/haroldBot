const options = require("./options.js")
const UserQueue = require("./UserQueue.js")
const log = require("./log.js")
const path = require("path")
const fs = require("fs")
const ytdl = require('ytdl-core');
const util = require('util');

module.exports = function(client){
	var users = [],
		nowPlaying = false;

	var updateQueues = () => {
		return new Promise((resolve) => {
			users.map((user) => {
				if (!user.queue) user.queue = new UserQueue(user)
			})
			log("[musicPlayer] update queues")
			resolve()
		})
	}

	var updateUsers = () => {
		var _self = this
		return new Promise((resolve) => {
			client.voiceConnections.map((el, id) => {
				if (id == options.guildId) {
					users = el.channel.members
				}
			})
			log("[musicPlayer] update users")
			resolve()
		})
	}

	var findAudioData = (url) => {
		return {
			url: url,
			name: "name of url " + url,
			addDate: Date.now()
		}
	}

	var refresh = () => {
		return new Promise((resolve) => {
			log("[musicPlayer] refresh")
			updateUsers()
				.then(updateQueues)
				.then(resolve)
		})
	}

	var getUsersWithQueue = () => {
		log("[musicPlayer] get users with queues ");
		return new Promise((resolve) => {
			let promises = [];
			users.map(user => {
				promises.push(new Promise((resolve2) => {
					log("[musicPlayer] checking user " + user);
					if (!user.user.bot) {
						 user.queue.getThis().then(song => {
							 //console.log('debug', song)
							 song ? resolve2(user) : resolve2(false)
						 })
					} else resolve2( false )
				}))
			})
			Promise.all(promises).then(resolve)
		})
	}

	var filterUsers = (users) => {
		return new Promise((resolve) => {
			resolve( users.filter(el => el ? el : false) )
		})
	}

	var checkUsersCount = (users) => {
		return new Promise((resolve, reject) => {
			if (users.length) {
				log(`[musicPlayer] ${users.length} users geted`)
				resolve(users)
			} else {
				reject('no users with songs')
			}
		})
	}

	var getRandomUser = (users) => {
		return new Promise((resolve, reject) => {
			let randomUserId = Math.round( Math.random() * ( users.length - 1 ) )
			let randomUser = users[ randomUserId ]
			if (!randomUser) reject ('invalid user')
			log(`[musicPlayer] selected ${randomUser}`)
			resolve(randomUser)
		})
	}

	var getAudio = (randomUser) => {
		return new Promise((resolve, reject) => {
			randomUser.queue.getThis()
			.then(audio => {
				let data = {
					user: randomUser,
					audio: audio
				}
				resolve(data)
			})
		})
	}

	var selectPlayerAndPlay = (data) => {
		return new Promise((resolve, reject) => {
			log(`[musicPlayer] audio geted ${ data.audio.fileName }`)
			var player;
			if (data.audio.local) {
				// playing from a fule from plugin
				player = playFile
			} else {
				//playing from url
				player = playUrl
			}
			player(data.audio)
				.then(() => {
					//after playing skip queue and play again
					data.user.queue.skip()
					resolve()
				})
				.catch(err => {
					console.error(err)
					reject(err)
				})
		})
	}

	var play = (url) => {
		log(`[musicPlayer] waiting for song`)
		if (nowPlaying) return
		getUsersWithQueue()
			.then(filterUsers)
			.then(checkUsersCount)
			.then(getRandomUser)
			.then(getAudio)
			.then(selectPlayerAndPlay)
			.then(() => setTimeout (play, 1000)) // play next
			.catch(reason => {
				log(`[musicPlayer] not playing because: ${reason}, next try after 5s` )
				setTimeout (play, 5000)
			})
	}

	var playFile = (data) => {
		return new Promise((resolve, reject) => {
			nowPlaying = data

			let filePath = path.join(__dirname, options.folders.cache, data.userId, data.fileName)
			let dispatcher = client.voiceConnections
				.filter((el, id) => id == options.guildId)
				.first()
				.playFile(filePath, { volume: 1 })

			dispatcher.on("error", reject)

			dispatcher.on("start", () => {
				log(`[musicPlayer] start playing file ${data.fileName}`)
			})

			dispatcher.on("end", () => {
				log(`[musicPlayer] end playing file ${data.fileName}`)
				nowPlaying = false
				resolve()
			})

		})
	}

	var playUrl = (url) => {
		return new Promise((resolve) => {
			nowPlaying = data
			let stream = ytdl(url, { filter : 'audioonly' });

			const streamOptions = { seek: 0, volume: 1 };
			let dispatcher = client.voiceConnections
				.filter((el, id) => id == options.guildId)
				.first()
				.playStream(stream, streamOptions)

			dispatcher.on("error", reject)

			dispatcher.on("start", () => {
				log(`[musicPlayer] start playing stream ${data.fileName}`)
			})
			dispatcher.on("end", () => {
				log(`[musicPlayer] end playing stream ${data.fileName}`)
				nowPlaying = false
				resolve()
			})
		})
	}

	var getAllQueues = () => users;

	var addRandomFromPlaylist = (member, count) => {
		member = users.find("id", member.id || member)
		for (let i = 0; i < count; i++) {
			member.queue.addFromPlayList()
		}
	}

	return {
		refresh: refresh,
		debug: (userId) => {
			return users.find("id", userId).queue.playList.remove( "name", "test" )
		},
		addUrl: (userId, url) => {
			users.find("id", userId).queue.add( findAudioData (url) )

			play(url)
		},
		addLocal: (data) => {
			data.local = true
			if (users) {
				let user = users.find("id", data.userId)
				if (user) {
					user.queue.add(data)
				} else {
					log(`[musicPlayer] Audio not added, user <@${data.userId}> not in voice channel with bot`)
				}
			}
		},
		play: play,
		getUsers: getUsersWithQueue,
		add: addRandomFromPlaylist,
		np: () => {
			return nowPlaying
		},
		allQueues: getAllQueues
	}
}
