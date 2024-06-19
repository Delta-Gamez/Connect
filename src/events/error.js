const { error } = require('../log.js');

module.exports = {
	name: 'error',
	execute: async(e) => {
        error(`Runtime Error: ${e}`);
		console.log(e)
}};
