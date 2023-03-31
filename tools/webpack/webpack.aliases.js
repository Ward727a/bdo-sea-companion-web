const { createWebpackAliases } = require('./webpack.helpers');

// Export aliases
module.exports = createWebpackAliases({
  '@assets': 'assets',
  '@components': 'src/renderer/components',
  '@updater': 'src/updater/components',
  '@common': 'src/common',
  '@main': 'src/main',
  '@renderer': 'src/renderer',
  '@src': 'src',
  '@misc': 'misc',
});
