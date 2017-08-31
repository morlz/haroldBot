const path = require("path")
const options = require("./options.js")
const fs = require("fs")
const log = require("./log.js")
const { EventEmitter } = require("events")

class UserPlayList extends EventEmitter {
	constructor (member) {
		super()

		this.member = member

		this.fileName = this.member.id + ".json"
		this.path = path.join(__dirname, options.folders.playLists) //
		this.cachePath = path.join(__dirname, options.folders.cache)

		this.checkFileExist()
			.then(() => log("[UserPlayList] " + this.member + " file checked"))
	}

	checkFileExist () {
		var _self = this
		return new Promise((resolve) => {
			if ( !fs.existsSync( path.join(_self.path, _self.fileName) ) ) {
				log("[UserPlayList] " + this.member + " created file: " + path.join(_self.path, _self.fileName))
				fs.writeFile( _self.path + _self.fileName, JSON.stringify( {
					"data" : []
				} ), resolve)
			} else {
				resolve ()
			}
		})
	}
	add (toAdd) {
		var _self = this,
			injectAudio = playList => {
				return new Promise ((resolve, reject) => {
					let finded = playList.data.filter(audio => audio.fileName == toAdd.fileName)

					if (!finded.length) playList.data.push(toAdd)
					if (finded.length) reject('audio already exist')
					resolve (playList)
				})
			},
			writeFile = playList => {
				fs.writeFile( path.join(_self.path, _self.fileName), JSON.stringify( playList ), (err) => {
					_self.cache = playList
					_self.emit("playListChange", playList)
					log("[UserPlayList] " + this.member + " added: " + toAdd.fileName)
				} )
			}

		return new Promise ((resolve, reject) => {
			_self.getAll()
				.then(injectAudio)
				.then(writeFile)
				.catch(reason => {
					log(`[UserPlayList] audio not added because: ${reason}`)
				})
		})
	}
	remove (field, content) {
		var _self = this
		return new Promise ((resolve, reject) => {
			_self.getAll()
				.then(playList => {
					var _remove = (id) => {
						return new Promise((resolve, reject) => {
							let removed = playList.data.splice(id, 1)[0]
							if (!removed) resolve()
							let cachedFilePath = path.join(this.cachePath, removed.userId + "/", removed.fileName)
							fs.unlink(cachedFilePath, err => {
								if (err) {
									log(`[UserPlayList] ${this.member} not removed ${removed.fileName} from cache. ${err}`)
								} else {
									log(`[UserPlayList] ${this.member} removed ${removed.fileName} from cache`)
								}
								resolve()
							})
							log(`[UserPlayList] ${this.member} removed ${removed.fileName} with id ${field} from playList`)
						})
					}

					return new Promise ((resolve) => {
						if (Array.isArray(field) && field.every(el => typeof el == 'number')) {
							let ps = []
							field.map(el => {
								ps.push(_remove(el))
							})
							Promise.all(ps)
								.then(() => resolve(playList))
						} else if (typeof field == 'number') {
							_remove(field)
								.then(() => resolve(playList))
						} else {
							playList.data = playList.data.filter(el => el[ field ] != content)
							log(`[UserPlayList] ${this.member} removed all where: field ${field} == ${content}`)
							resolve(playList)
						}

						//reject("[UserPlayList] remove() invalid arguments")
					})
				})
				.then(playList => {
					fs.writeFile( path.join(_self.path, _self.fileName), JSON.stringify( playList ), (err) => {
						_self.cache = playList
						_self.emit("playListChange", playList)
					} )
				})
				.catch(console.error)
		})
	}
	getAll () {
		var _self = this
		return new Promise ((resolve, reject) => {
			if (_self.cache) {
				log("[UserPlayList] " + this.member + " get all from cache")

				resolve( _self.cache )
			} else {
				fs.readFile( path.join(_self.path, _self.fileName), 'utf8', (err, data) => {
					if (err) reject (err)
					let playList = JSON.parse( data )

					_self.cache = playList

					log("[UserPlayList] " + this.member + " get all file content")

					resolve ( playList )
				})
			}
		})
	}
	get (id) {
		log(`[UserPlayList] ${this.member} get 1 random from playList`)
		return new Promise((resolve) => {
			new Promise((resolve2) => {
				 if (this.cache) {
					 resolve2(this.cache)
				} else {
					this.getAll()
						.then(resolve2)
						.catch(() => {
							log(`[UserPlayList] ${this.member} error read playList file`)
							resolve()
						})
				}
			}).then(from => {
				log(`[UserPlayList] get from ${this.cache ? 'cache' : 'file'}`)
				if (from.data.length) {
					if (id == "random") {
						let random = Math.round( Math.random() * ( from.data.length - 1 ) )
						let randomized = from.data[ random ]

						log(`[UserPlayList] ${this.member} get random ${randomized.fileName} with id ${random + 1} of ${from.data.length}`)
						resolve(randomized)
					} else {
						let geted = from.data[ id ]
						log(`[UserPlayList] ${this.member} get ${geted.fileName} with id ${id + 1} of ${from.data.length}`)
						resolve(geted)
					}
				} else {
					log(`[UserPlayList] ${this.member} playList is empty`)
					resolve()
				}
			})
		})
	}
}

module.exports = UserPlayList
