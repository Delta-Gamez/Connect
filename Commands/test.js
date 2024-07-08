const { SlashCommandBuilder } = require("discord.js");
const { info } = require("../src/log.js");
const { embedAbout } = require("../embeds.js");
const { askQuestion } = require("../utils/utils.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Provides infomation about Connect."),
    async execute(interaction) {
        const data = await askQuestion(interaction, "What should the Questions be?")
        console.log(`Data: ${data}`)
    },
};

