const { info } = require('../log.js');

module.exports = {
	name: 'Debug',
	execute: async(e) => {
        info(`Runtime Debug: ${e}`);
}};
