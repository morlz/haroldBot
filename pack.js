const nexe = require('nexe')

nexe.compile({
  input: './assets/main.js',
  output: './exec/main.exe',
  patches: [
    async (compiler, next) => {
      await compiler.setFileContentsAsync(
        'lib/new-native-module.js',
        'module.exports = 42'
      )
      return next()
    }
  ]
}).then(() => {
  console.log('success')
})
