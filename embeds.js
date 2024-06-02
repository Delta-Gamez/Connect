const { timeStamp } = require('console');
const { EmbedBuilder, Embed } = require('discord.js');

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
    Success: {
        title: 'SUCCESS',
        color: colorSuccess,
        footer: 'Connect',
        timeStamp: '',
    }, 
    Warn: {
        title: 'WARNING',
        color: colorWarn,
    }, 
    Error: {
        title: (iconError, 'ERROR'),
        color: colorError
    }, 
    Info: {
        title: 'INFO',
        color: colorInfo
    }
}


// Connect Embeds /*This is still in work, please don't make any edits to it.*/

const embedConnectTemplate = new EmbedBuilder().setFooter('Connect');
const embedConnect = {
    Template: embedConnectTemplate,
    DescriptionUpdated: new EmbedBuilder(embedInfo.Success)
        .setTitle(iconSuccess, 'DESCRIPTION UPDATED')
        .setDescription('Your community description has been updated.'),
    ModalSubmit: new EmbedBuilder(embedInfo.Success)
        .setDescription('Your community has sucessfully been submitted and will now be processed.'),
    Error: new EmbedBuilder(embedInfo.Error, embedConnectTemplate)
        .setDescription('Error'),
    OutsideServer: new EmbedBuilder(embedInfo.Error, embedConnectTemplate)
        .setTitle(iconError, messageErrorServer)
        .setDescription('You need to be in a server to use this!'),
    ServerOwner: new EmbedBuilder(embedInfo.Error, embedConnectTemplate)
        .setTitle(iconError, 'ERROR')
        .setDescription('Only the server owner can run this command.'),
    ModalSumbit: new EmbedBuilder(embedInfo.Success, embedConnectTemplate)
        .setTitle(iconSuccess, 'SERVER SUBMITTED')
        .setDescription('Your server has sucessfully been submitted and will now be processed.'),
    ModalProcess: new EmbedBuilder(embedInfo.Error, embedConnectTemplate)
        .setTitle(iconError, messageErrorServer)
        .setDescription(
            'An error occurred while processing your form.\n Please try again later.',
        ),
    Process: new EmbedBuilder(embedInfo.Error, embedConnectTemplate)
        .setTitle(iconError, messageErrorServer)
        .setDescription(
            'An error occurred while processing your request.\n Please try again later.',
        ),
    ErrorDatabase: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(iconError, messageErrorServer)
        .setDescription(
            'Database could not be reached.\n Please try again later or contact support.',
        ),

    };


// Partnership Embeds /*This is still in work, please don't make any edits to it.*/
const embedPartnershipTemplate = new EmbedBuilder().setColor(colorInfo).setFooter('Connect Partnerships');
const embedPartnership = {
    Template: embedConnectTemplate,
    Submitted: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(iconError, 'SERVER ERROR')
        .setDescription('You need to be in a server to use this!'),
    };
    




// Info Success Embeds
const embedInfoSuccessTemplate = new EmbedBuilder().setColor(colorSuccess).setFooter('Connect');
const embedInfoSuccess = {
    Template: embedInfoSuccessTemplate,
    ModalSumbit: new EmbedBuilder(embedInfoSuccessTemplate)
        .setTitle(iconSuccess, 'SERVER SUBMITTED')
        .setDescription(
            'Your server has sucessfully been submitted and will now be processed.',
        )
        .setFooter('Connect')
};

// Info Warn Embeds
const embedInfoWarnTemplate = new EmbedBuilder().setColor(colorWarn).setFooter('Connect');

// Info Error Embeds
const embedInfoErrorTemplate = new EmbedBuilder().setColor(colorError).setFooter('Connect');
const embedInfoError = {
    Template: embedInfoErrorTemplate,
    ServerError: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(iconError, messageErrorServer)
        .setDescription('You need to be in a server to use this!'),
    ServerOwner: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(iconError, 'ERROR')
        .setDescription('Only the server owner can run this command.'),
    ModalProcess: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(iconError, messageErrorServer)
        .setDescription(
            'An error occurred while processing your form. Please try again later.',
        ),
    Process: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(iconError, messageErrorServer)
        .setDescription(
            'An error occurred while processing your request.\n Please try again later.',
        ),
    ServerConnectionError: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(iconError, messageErrorServer)
        .setDescription(
            'Database could not be reached.\n Please try again later or contact support.',
        ),
};

// Styling Variables
const messageErrorServer = 'SERVER ERROR';

const colorSuccess = '#45BB8A';
const colorWarn = '#FFB53E';
const colorError = '#F14647';
const colorInfo = '#00469F';

const iconSuccess = '<:DG_CO_Check:1028309734450806815> &nbsp';
const iconWarn = '<:DG_CO_Warn:1142925963668238536> &nbsp';
const iconError = '<:DG_CO_Error:1142926009579094226> &nbsp';


// Exporting Embeds
module.exports = {
    embedLog,
    embedInfoError,
    embedConnect,
    embedInfoSuccess,
};
