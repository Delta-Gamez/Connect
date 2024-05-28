const { warn } = require('../log.js');

module.exports = {
	name: 'warn',
	execute: async(e) => {
        warn(`Runtime warning: ${e}`);
}};
