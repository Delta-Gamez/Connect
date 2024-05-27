const { EmbedBuilder } = require('discord.js');

// Templates for Embeds
const errortemplate = new EmbedBuilder()
    .setColor('#880808')

const successtemplate = new EmbedBuilder()
    .setColor('#004898')


// Error Embeds
const servererror = new EmbedBuilder(errortemplate)
    .setTitle('Server Error')
    .setDescription('You need to be in a server to use this!');

const serverowner = new EmbedBuilder(errortemplate)
    .setTitle('Server Owner')
    .setDescription('Only the server owner can use this command.');

const formprocceserror = new EmbedBuilder(errortemplate)
    .setTitle('Server Error')
    .setDescription('An error occurred while processing your form. Please try again later.');

const serverlerror = new EmbedBuilder(errortemplate)
    .setTitle('Server Error')
    .setDescription('An error occurred while processing your request.\n Please try again later.');

const ServerErrorformconnectionerror = new EmbedBuilder(errortemplate)
    .setTitle('Server Error')
    .setDescription('Uh-oh! An error occurred while sending your form to our servers. Try again in a few minutes.');

const signedin = new EmbedBuilder(errortemplate)
    .setTitle('You already have a account.')
    .setDescription('Since you already have a account no further action is needed.');


// Success Embeds
const addserverformsumbit = new EmbedBuilder(successtemplate)
    .setTitle('Server Submitted')
    .setDescription('Thank you! Your form has been submitted and will now be processed.');

const signedup = new EmbedBuilder(successtemplate)
    .setTitle('Account Created')
    .setDescription('Thank you for signing up with Connect!');

// Exporting Embeds
module.exports = {
    servererror,
    serverowner,
    addserverformsumbit,
    ServerErrorformconnectionerror,
    formprocceserror,
    signedin,
    signedup,
    serverlerror
};