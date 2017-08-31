const log = require("./log.js")
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const util = require('util');
const EventEmitter = require('events')
const options = require("./options.js")
const path = require("path")
const isBuffer = require('is-buffer')
const htmlspecialchars_decode = require("./htspDecode.js")
const nodeID3 = require('node-id3');

class MusicFromPlugin extends EventEmitter {
	constructor () {
		super()
		this.init()
	}

	init () {
		var _self = this
		http.createServer(function (req, res) {
			res.setHeader("Access-Control-Allow-Origin", "*")
			res.setHeader("Access-Control-Allow-Methods", "POST")
			res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

			let form = new formidable.IncomingForm()

			form.uploadDir = path.join(__dirname, options.folders.tmp)


			form.parse(req, function (err, fields, files) {
				if (!files.kek || !fields.userId) {
					res.end("???")

					log("[musicFromPlugin] not valid \n" +
						util.inspect({
							fields: fields,
							files: files,
							host: req.headers.host,
							origins: req.headers.origin,
							userAgent: req.headers['user-agent'],
							contentType: req.headers['content-type']
						})
					);
					return
				}

				let cachePath = path.join(__dirname, options.folders.cache, fields.userId)

				if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath)

				let splited = files.kek.path.split("\\")

				let names = {
					oldName: path.join(__dirname, splited[ splited.length - 2 ], splited[ splited.length - 1 ] ),
					newName: path.join(cachePath,  _self.checkName(files.kek.name))
				}

				_self.rename(names)
					.then(data => _self.renameToMaybeRealName(data, fields.userId))
					.then(data => new Promise((resolve) => {
						res.end("kek")
						resolve( Object.assign( { userId: fields.userId }, data ) )
					}))
					.then(data => _self.newSongHandler(data))
					.catch(console.error)
			})
		}).listen(80)
	}

	newSongHandler(data) {
		var _self = this
		let splited = data.newName.split("\\")
		let fileName = splited[ splited.length - 1 ]
		log(`[musicFromPlugin] ready to add song ${fileName} to user ${data.userId}`);
		_self.emit("song", {userId: data.userId, fileName: fileName})
	}

	rename (names) {
		return new Promise((resolve, reject) => {
			log(`[musicFromPlugin]\n\trename: \t${names.oldName} \n\tto: \t\t${names.newName}`)
			fs.rename(names.oldName, names.newName, (err) => {
				if (err) reject (err)
				resolve (names)
			})
		})
	}

	renameToMaybeRealName (names, userId) {
		var _self = this
		return new Promise((resolve, reject) => {
			if ( names.newName.match( /[А-Я]/gi ) ) resolve (names)
			log("[musicFromPlugin] try to get tags from: " + names.newName)
			let tags = nodeID3.read(names.newName)
			if (tags && tags.artist && tags.title) {
				let newNames = {
					oldName: names.newName,
					newName: path.join(__dirname, options.folders.cache, userId, _self.checkName(`/${tags.artist} - ${tags.title}.mp3`))
				}
				_self.rename(newNames)
					.then(resolve)
			} else resolve (names)
		})
	}

	checkName (name) {
		let regExp = new RegExp('[/*?<>|`:"]', "g")

		return htmlspecialchars_decode(	name).split("&nbsp;–&nbsp;").join(" - ").replace(regExp, '')
	}
}

module.exports = new MusicFromPlugin()
