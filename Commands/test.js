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
        interaction.reply({ content: `* *** 🏙️  :─ Auckland City Roleplay -: 🏙️  *** *

Welcome to Auckland City Roleplay We are a roleplay server that has a great roleplay community and multiple departments to join. 
 

═══════════════════
What do we offer?


➤ Normal Roleplays
➤ AOS (Armed Offenders Squad) Roleplays
➤ In-Game/Server Staff Application
➤ Active community
➤ Daily SSU’S
➤ Active and friendly staff

════════════════════════════════
What Departments do we include?

🚓 : New Zealand Police Department 
🚒 : Fire New Zealand
🚑 : St John Department
👷‍♂️ : AA road service and Transport Agency
🏞️ : High Rock Park | Park Ranger
🪖 : New Zealand Military (WHITELISTED)
════════════════════════════════
What Civilians Jobs do we include?

🚕 | NZ Taxi/Limo Services
🍟 | Three Guys Restaurant Job
💎 | Jewelry Store Worker
🔫 | Gun Store Dealer
☕ | Liberty Café Worker
And so much more.
════════════════
ACRP Management

📖 ➝ Staff Applications Are Open! Looking for more staff.

📖 Partnership Manager applications are also open So please reach out.
══════════════════════════
Links

🔗https://cdn.discordapp.com/attachments/1053462467990270072/1058259301849911327/standard_3.gif
🔗 https://discord.gg/B8aNbVZUUa
Server name: ACRP I Auckland City Roleplay
══════════════════════════
 Information

We are currently working on a handful of NZTA along with some amazing server updates that will be released soon.

We're a professional community that is very thankful for everyone that joins.

Our goal is to have 700+ members So if you're active please join us here in Auckland City Roleplay. This server is extremely organized with over 130 roles If you’re looking for a genuine, chill server with a very friendly community you’ve come to the right place where we welcome everyone to the server so why not come join the fun.

Founders : <@817691000197218314> <@950631774835343410>             Rep <@1044851224178081833>`})
    },
};

