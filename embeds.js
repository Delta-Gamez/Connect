const { EmbedBuilder } = require('discord.js');

const servererror = new EmbedBuilder()
    .setColor('#004898')
    .setTitle('Server Error')
    .setDescription('You need to be in a server to use this!');

const serverowner = new EmbedBuilder()
    .setColor('#004898')
    .setTitle('Server Owner')
    .setDescription('Only the server owner can use this command.');

const signupformsumbit = new EmbedBuilder()
    .setColor('#004898')
    .setTitle('Server Submitted')
    .setDescription('Thank you! Your form has been submitted and will now be processed.');

const signupformerror = new EmbedBuilder()
    .setColor('#004898')
    .setTitle('Server Error')
    .setDescription('An error occurred while processing your form. Please try again later.');

const signupformconnectionerror = new EmbedBuilder()
    .setColor('#004898')
    .setTitle('Server Error')
    .setDescription('Uh-oh! An error occurred while sending your form to our servers. Try again in a few minutes.');

module.exports = {
    servererror,
    serverowner,
    signupformsumbit,
    signupformerror,
    signupformconnectionerror
};