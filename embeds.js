const { EmbedBuilder } = require('discord.js');

const servererror = new EmbedBuilder()
    .setColor('#880808')
    .setTitle('Server Error')
    .setDescription('You need to be in a server to use this!');

const serverowner = new EmbedBuilder()
    .setColor('#880808')
    .setTitle('Server Owner')
    .setDescription('Only the server owner can use this command.');

const addserverformsumbit = new EmbedBuilder()
    .setColor('#004898')
    .setTitle('Server Submitted')
    .setDescription('Thank you! Your form has been submitted and will now be processed.');

const signupformerror = new EmbedBuilder()
    .setColor('#880808')
    .setTitle('Server Error')
    .setDescription('An error occurred while processing your form. Please try again later.');

const ServerErrorformconnectionerror = new EmbedBuilder()
    .setColor('#880808')
    .setTitle('Server Error')
    .setDescription('Uh-oh! An error occurred while sending your form to our servers. Try again in a few minutes.');

const notsignedin = new EmbedBuilder()
    .setColor('#880808')
    .setTitle('Not Signed In')
    .setDescription('You must be signed in to use this command.\nYou can sign in [here](https://localhost:3000/login).\nTo create a account you can sign up [here](https://localhost:3000/signup).');

const signedin = new EmbedBuilder()
    .setColor('#880808')
    .setTitle('Already Signed In')
    .setDescription('You are already signed in!');

const accountloggedin = new EmbedBuilder()
    .setColor('#004898')
    .setTitle('Account Logged In')
    .setDescription('You are now logged in!');

const accountcreated = new EmbedBuilder()
    .setColor('#004898')
    .setTitle('Account Created')
    .setDescription('Your account has been created!');

module.exports = {
    servererror,
    serverowner,
    addserverformsumbit,
    signupformerror,
    ServerErrorformconnectionerror,
    notsignedin,
    signedin,
    accountcreated,
    accountloggedin
};