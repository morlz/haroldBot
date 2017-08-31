const options = require("./options.js")
const UserPlayList = require("./UserPlayLists.js")
const log = require("./log.js")
const util = require('util');
const { EventEmitter } = require("events")

class UserQueue extends EventEmitter {
	constructor (member) {
		super()
		this.member = member
		this.queue = []
		this.playList = new UserPlayList(member)
	}
	add (toAdd) {
		toAdd.addTime = Date.now()
		this.queue.push(toAdd)
		this.playList.add(toAdd)
		this.emit("changed", this.queue)

		log(`[userQueue] ${this.member} added ${toAdd.fileName}`)
	}
	remove (id) {
		if (id == "all") {
			this.queue = []
		} else {
			this.queue.splice(id, 1)
		}
		if (!this.queue.length) this.addFromPlayList()
		this.emit("changed", this.queue)
	}
	skip () {
		log(`[UserQueue] ${this.member} skiped`)
		this.remove(0)
	}
	getAll() {
		log(`[UserQueue] ${this.member} get all`)
		return this.queue
	}
	addFromPlayList () {
		log(`[UserQueue] ${this.member} add 1 in queue from play list`)
		return new Promise((resolve) => {
			this.playList.get("random").then(random => {
				this.queue.push(random)
				this.emit("changed", this.queue)
				resolve(random)
			})
		})
	}
	fix () {
		this.queue = this.queue.filter(el => el ? el : false)
		this.emit("changed", this.queue)
	}
	getThis () {
		var _self = this
		log(`[UserQueue] ${_self.member} try to get 1 from queue`)

		return new Promise((resolve, reject) => {
			if (!_self.queue.length) {
				log(`[UserQueue] queue is empty`)
				_self.addFromPlayList()
					.then(resolve)
			} else {
				log(`[UserQueue] ${_self.member} get ${_self.queue[0] ? _self.queue[0].fileName : 'void'} from queue`)
				if (!_self.queue[0]) _self.fix()
				resolve( _self.queue[0] )
			}
		})
	}
}

module.exports = UserQueue
