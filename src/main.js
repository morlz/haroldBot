const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs")
const ytdl = require("ytdl-core")
const http = require("http")
const path = require("path")
const log = require("./modules/log.js")
const musicFromPlugin = require("./modules/musicFromPlugin.js")
const options = require("./modules/options.js")
const musicPlayer = require("./modules/musicPlayer.js")
musicPlayer.init(client)

const util = require('util');
const api = require("./modules/api.js")

api.bind(client, musicPlayer)

const externalip = require("externalip")

var hostIp = "127.0.0.1",
	reg = () => {
		externalip((err, ip) => {
			hostIp = ip
			api.register(ip, options.guildId)
		})
	}


reg()
setInterval(reg, 60000)



'use strict'


var messages = {
	'play' : (msg) => {
		let splited = msg.content.split(" ")
		let url = splited.splice(1, splited.length) [0]
		//musicPlayer.addUrl ( msg.member.id, url )
	},
	'host' : (msg) => {
		msg.reply( `hosted on ${hostIp}` )
	},
	'stop' : (msg) => {

	},
	'pause' : (msg) => {

	},
	'resume' : (msg) => {

	},
	'volume' : (msg) => {

	},
	'loli' : (msg) => {
		let botGuildMember = client.guilds.find("id", options.guildId).members.find("id", client.user.id);
		["пошёл нахуй :)", "Harold"].forEach((el, id) => {
			setTimeout(() => {
				botGuildMember.setNickname(el)
			}, id * 1000)
		})

		msg.reply( 'https://cdn.discordapp.com/attachments/345930097250926602/351458063125053440/MOvL9CT49ME.png' )
	},
	'clear' : (msg) => {

	},
	'queue' : (msg) => {
		let splited = msg.content.split(" ")
		let param = splited.splice(1, 1)
		var sendMsg = (replyMsg) => {
			msg.reply( replyMsg )
		}
		musicPlayer.getUsers().then(queues => {
			log("[main] get all queues")
			let replyMsg = "\n queues: \n";
			queues.map(user => {
				if (!user) return
				if (param != 'all' && user.id != msg.member.id) return
				replyMsg += `${user}:\n`
				user.queue.getAll().forEach((el, id2) => {
					if (!el) return
					let tmp = `\t${id2 + 1}.\t${el.fileName}\n`
					if (replyMsg.length + tmp.length > 1900) {
						sendMsg(replyMsg)
						replyMsg = '\n'
					}
					replyMsg += tmp
				})
			})
			//log("send message: " + replyMsg)
			sendMsg ( replyMsg )
		})
	},
	'reconnect' : (msg) => {

	},
	'off' : (msg) => {
		let voiceConnection = client.voiceConnections.filter((el, id) => id == options.guildId).first()
		if (voiceConnection) voiceConnection.disconnect()

		log( "[main] stoped by " + msg.member )
		process.exit( 0 )
	},
	'summon' : (msg) => {
		if (msg.member.voiceChannel) {
			msg.member.voiceChannel.join().then(connection => {
				log( '[main] joined' )
				musicPlayer.refresh()
					.then(() => {
						//let dispatcher = client.voiceConnections.filter((el, id) => id == options.guildId).first().dispatcher

						if (!musicPlayer.np()) musicPlayer.play()
					})
			}).catch(console.log)
		}
	},
	'np' : (msg) => {
		msg.reply( musicPlayer.np ? `now playing ${musicPlayer.np.fileName || musicPlayer.np.name}` : 'now not playing' )
	},
	'help' : (msg) => {

	},
	'skip' : (msg) => {
		log("[main] skiped by " + msg.member)
		let dispatcher = client.voiceConnections.filter((el, id) => id == options.guildId).first().dispatcher
		if (dispatcher) dispatcher.end("skip")
	},
	'playlist' : (msg) => {
		var getPlayList = users => {
			return new Promise((resolve) => {
				users.map(user => {
					if (user.id == msg.member.id) user.queue.playList.getAll().then(resolve)
				})
			})
		}

		var createMsg = playList => {
			return new Promise((resolve) => {
				let replyMsg = `\n`
				playList.data.map((el, id) => {
					let tmp = `${id + 1}.\t ${el.fileName}\n`
					if (replyMsg.length + tmp.length > 1950) {
						sendMsg(replyMsg)
						replyMsg = `\n`
					}
					replyMsg += tmp
				})
				resolve(replyMsg)
			})
		}

		var sendMsg = (replyMsg) => {
			msg.reply( replyMsg )
		}

		log(`[main] ${msg.member} get playList`)

		musicPlayer.getUsers()
			.then(getPlayList)
			.then(createMsg)
			.then(sendMsg)

	},
	'add': (msg) => {
		let splited = msg.content.split(" ")
		let count = +( splited.splice(1, 1) )
		let min = 0, max = 50
		if (count > min && count <= max) {
			let voiceConnection = client.voiceConnections.filter((el, id) => id == options.guildId).first()
			if (msg.member.voiceChannelID && voiceConnection.channel.id == msg.member.voiceChannelID) {
				musicPlayer.add(msg.member, count)
			} else {
				msg.reply(`зайди ко мне в канал`)
			}
		} else msg.reply(`incorrect input! min: ${min}, max: ${max}`)
	},

	//debug

	'debug2' : (msg) => {
		musicPlayer.play()
	},
	'debug1' : (msg) => {
		msg.member.voiceChannel.join()
			.then(connection => {
				connection.playFile(`C:/test.mp3`)
			})
	}
}

musicFromPlugin.on("song", data => {
	musicPlayer.addLocal(data)
})

client.on("message", (msg) => {
	if (msg.content.indexOf(options.prefix) != 0) return

	log( "[main] get message: " + msg.content )

	let splited = msg.content.split(" ")

	splited[0] = splited[0].substr(options.prefix.length, splited[0].length)  // remove prefix

	if (messages[ splited[0] ]) messages[ splited[0] ]( msg )
})

client.on("voiceStateUpdate", () => {
	musicPlayer.refresh()
})

client.on("ready", () => {
	log( "[main] Bot connected" )
	let voiceChannels = client.guilds.find("id", options.guildId).channels.findAll("type", "voice")

	var join = () => {
		return new Promise((resolve, reject) => {
			log("[main] try to join " + voiceChannels[0])
			voiceChannels[0].join()
				.then(resolve)
				.catch(reject)
		})
	}
	join().then(() => { musicPlayer.play() })
})



client.login(options.token)

log( "[main] Bot started" )
