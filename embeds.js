const { EmbedBuilder } = require("discord.js");

// Logging Templates:
const embedLog = {
    Success: {
        title: "\x1b[0m[SUCCESS]",
        color: "#00703c",
    },
    Warn: {
        title: "\x1b[0;33m[WARN]",
        color: "#ffdd00",
    },
    Error: {
        title: "\x1b[0;1;31m[ERROR]",
        color: "#d4351c",
    },
    Info: {
        title: "\x1b[0m[INFO]",
        color: "#00703c",
    }
};

// Error Embeds
const embedInfoErrorTemplate = new EmbedBuilder().setColor("#880808");
const embedInfoError = {
    Template: embedInfoErrorTemplate,
    ServerError: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle("Server Error")
        .setDescription("You need to be in a server to use this!"),
    ServerOwner: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle("Server Owner")
        .setDescription("Only the server owner can use this command."),
    ModalProcess: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`Server Error`)
        .setDescription(
            "An error occurred while processing your form. Please try again later.",
        ),
    Process: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`Server Error`)
        .setDescription(
            "An error occurred while processing your request.\n Please try again later.",
        ),
    ServerConnectionError: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`Server Error`)
        .setDescription(
            "An error occured, and I couldn't quite reach my database.\n Please try again later.",
        ),
};

// Success Embeds
const embedInfoSuccessTemplate = new EmbedBuilder().setColor("#004898");
const embedInfoSuccess = {
    Template: embedInfoSuccessTemplate,
    ModalSumbit: new EmbedBuilder(embedInfoSuccessTemplate)
        .setTitle("Server Submitted")
        .setDescription(
            "Thank you! Your form has been submitted and will now be processed.",
        ),
};

// Exporting Embeds
module.exports = {
    embedLog,
    embedInfoError,
    embedInfoSuccess,
};
