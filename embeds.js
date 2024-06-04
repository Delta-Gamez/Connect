/*const { timeStamp } = require('console');*/
const { EmbedBuilder, Embed } = require('discord.js');

// Styling Variables
const messageErrorServer = 'SERVER ERROR';

const colorSuccess = '#45BB8A';
const colorWarn = '#FFB53E';
const colorError = '#F14647';
const colorInfo = '#00469F';

const iconSuccess = '<:DG_CO_Check:1028309734450806815> ';
const iconWarn = '<:DG_CO_Warn:1142925963668238536> ';
const iconError = '<:DG_CO_Error:1142926009579094226> ';

const embedConnectFooter = new EmbedBuilder().setFooter({ text: 'Connect' });
const embedPartnershipFooter = new EmbedBuilder().setFooter({ text: 'Connect Partnership '});

// Log Embeds
const embedLog = {
    Success: {
        title: '\x1b[0m[SUCCESS]',
        color: colorSuccess,
    },
    Warn: {
        title: '\x1b[0;33m[WARN]',
        color: colorWarn,
    },
    Error: {
        title: '\x1b[0;1;31m[ERROR]',
        color: colorError,
    },
    Info: {
        title: '\x1b[0m[INFO]',
        color: colorInfo,
    }
};


const embedInfo = {
    Success: new EmbedBuilder()
        .setTitle('SUCCESS')
        .setColor(colorSuccess)
        .setFooter({ text: 'Connect'})
        .setTimestamp(), 

    Warn: new EmbedBuilder()
        .setTitle('WARNING')
        .setColor(colorWarn),

    Error: new EmbedBuilder()
        .setTitle(`${iconError} ERROR`)
        .setColor(colorError),

    Info: new EmbedBuilder()
        .setTitle('INFO')
        .setColor(colorInfo),
}


// Connect Embeds /*This is still in work, please don't make any edits to it.*/

const embedConnect = {
    DescriptionUpdated: new EmbedBuilder(embedInfo.Success, embedConnectFooter)
        .setTitle(`${iconSuccess} DESCRIPTION UPDATED`)
        .setDescription('Your community description has been updated.'),
    ModalSubmit: new EmbedBuilder(embedInfo.Success, embedConnectFooter)
        .setDescription('Your community has sucessfully been submitted and will now be processed.'),
    Error: new EmbedBuilder(embedInfo.Error, embedConnectFooter)
        .setDescription('Error'),
    OutsideServer: new EmbedBuilder(embedInfo.Error, embedConnectFooter)
        .setTitle(`${iconError} messageErrorServer`)
        .setDescription('You need to be in a server to use this!'),
    ServerOwner: new EmbedBuilder(embedInfo.Error, embedConnectFooter)
        .setTitle(`${iconError} ERROR`)
        .setDescription('Only the server owner can run this command.'),
    ModalSumbit: new EmbedBuilder(embedInfo.Success, embedConnectFooter)
        .setTitle(`${iconSuccess} SERVER SUBMITTED`)
        .setDescription('Your server has sucessfully been submitted and will now be processed.'),
    ModalProcess: new EmbedBuilder(embedInfo.Error, embedConnectFooter)
        .setTitle(`${iconError} messageErrorServer`)
        .setDescription(
            'An error occurred while processing your form.\n Please try again later.',
        ),
    Process: new EmbedBuilder(embedInfo.Error, embedConnectFooter)
        .setTitle(`${iconError} messageErrorServer`)
        .setDescription(
            'An error occurred while processing your request.\n Please try again later.',
        ),
    ErrorDatabase: new EmbedBuilder(embedInfo.Error, embedConnectFooter)
        .setTitle(`${iconError} messageErrorServer`)
        .setDescription(
            'Database could not be reached.\n Please try again later or contact support.',
        ),

    };


// Partnership Embeds /*This is still in work, please don't make any edits to it.*/
const embedPartnership = {
    Submitted: new EmbedBuilder(embedInfo.Error, embedPartnershipFooter)
        .setTitle(`${iconError} SERVER ERROR`)
        .setDescription('You need to be in a server to use this!'),
    };




// Info Success Embeds
const embedInfoSuccessTemplate = new EmbedBuilder().setColor(colorSuccess).setFooter({ text: "Connect" });
const embedInfoSuccess = {
    Template: embedInfoSuccessTemplate,
    ModalSumbit: new EmbedBuilder(embedInfoSuccessTemplate)
        .setTitle(`${iconSuccess} SERVER SUBMITTED`)
        .setDescription(
            'Your server has sucessfully been submitted and will now be processed.',
        )
};

// Info Warn Embeds
/*const embedInfoWarnTemplate = new EmbedBuilder().setColor(colorWarn).setFooter('Connect');*/

// Info Error Embeds
const embedInfoErrorTemplate = new EmbedBuilder().setColor(colorError).setFooter({ text: "Connect" });
const embedInfoError = {
    Template: embedInfoErrorTemplate,
    ServerError: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} messageErrorServer`)
        .setDescription('You need to be in a server to use this!'),
    ServerOwner: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} 'ERROR'`)
        .setDescription('Only the server owner can run this command.'),
    ModalProcess: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} messageErrorServer`)
        .setDescription(
            'An error occurred while processing your form. Please try again later.',
        ),
    Process: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} messageErrorServer`)
        .setDescription(
            'An error occurred while processing your request.\n Please try again later.',
        ),
    ServerConnectionError: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} messageErrorServer`)
        .setDescription(
            'Database could not be reached.\n Please try again later or contact support.',
        ),
};


// Exporting Embeds
module.exports = {
    embedLog,
    embedInfo,
    embedConnect,
    embedInfoError,
    embedInfoSuccess
};
