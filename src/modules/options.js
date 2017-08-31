'use strict'

const fs = require("fs")
const path = require('path')

let folders = {
	playLists: "playLists/",
	cache: "cache/",
	tmp: "tmp/"
}

let defaultOptions = {
	token: 'app token here',
	prefix: '!',
	guildId: "your server id here",
	folders: folders
}

let configFile = path.join(__dirname, "/config.json")
if( !fs.existsSync( configFile ) ) {
	fs.writeFileSync( configFile , JSON.stringify(defaultOptions) )
	process.exit( 0 )
}

let options = JSON.parse( fs.readFileSync( configFile ) )

if (
	options.token == "app token here" ||
	options.token.length != 59 ||
	options.guildId == "your server id here" ||
	options.guildId.length != 18 ||
	typeof +options.guildId != 'number'
) {
	console.log("invalid config")
	process.exit( 0 )
}

/*
let options = {
	token: "MzQ1OTA1NzAxNjM5Njg0MTA2.DHCgYA.1SMCcJem_lXdWVuS90LNXFFpznA",
	prefix: "!",
	guildId: "345551217918738432",
	folders: folders
}
*/

for (let i in options.folders) {
	let folder = path.join(__dirname, folders[i])
	if( !fs.existsSync( folder ) ) fs.mkdirSync( folder )
}

module.exports = options
