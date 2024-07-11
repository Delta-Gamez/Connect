/*const { timeStamp } = require('console');*/
const { EmbedBuilder, Embed } = require('discord.js')
const axios = require('axios');

// Styling Variables
const messageErrorServer = 'SERVER ERROR';
const messageErrorPermission = 'PERMISSION ERROR';
const messageButtonTimeout = '`Button confirmation not received within 60s, cancelling request.`';

const colorSuccess = '#45BB8A';
const colorWarn = '#FFB53E';
const colorError = '#F14647';
const colorInfo = '#00469F';

const iconSuccess = '<:DG_CO_Check:1028309734450806815>';
const iconWarn = '<:DG_CO_Warn:1142925963668238536>';
const iconError = '<:DG_CO_Error:1142926009579094226>';
const iconDisable = '<:DG_CO_Cross:1163377608025702410>';
const iconConnect = '<:DG_CO_Connect:1249377684962803794>';
const iconConnectB = '<:DG_CO_ConnectBlack:1203623412271022150>';
const iconMembers = '<:DG_CO_Members:1257658527426674731>';
const iconBoost = '<:DG_CO_NitroBoost:1107640916182839317>'

const iconURLConnect = 'https://cdn.discordapp.com/emojis/1249377684962803794.webp?size=22&quality=lossless'
const iconURLCommunity = 'https://cdn.discordapp.com/emojis/1172188410522386533.webp?size=22&quality=lossless'
const iconURLConnectB = 'https://connect.deltagamez.ch/common/img/ConnectTransparentB.png'

const footerConnect = { text: 'Connect', iconURL: iconURLConnectB };
const footerPartnership = { text: 'Connect Partnership', iconURL: iconURLConnectB };

const moduleEnabled = { name: 'MODULE STATUS', value: `${iconSuccess}\u200B \`ENABLED\`\n\u200B`}
const moduleDisabled = { name: 'MODULE STATUS', value: `${iconError}\u200B \`DISABLED\`\n\u200B`}

// Log Embeds
const embedLog = {
    Success: {
        title: '\x1b[SUCCESS]',
        color: colorSuccess,
    },
    Warn: {
        title: '\x1b[WARN]',
        color: colorWarn,
    },
    Error: {
        title: '\x1b[ERROR]',
        color: colorError,
    },
    Info: {
        title: '\x1b[INFO]',
        color: colorInfo,
    }
};

const embedInfo = {
    Success: new EmbedBuilder()
        .setTitle('SUCCESS')
        .setColor(colorSuccess)
        .setTimestamp(), 

    Warn: new EmbedBuilder()
        .setTitle('WARNING')
        .setColor(colorWarn)
        .setTimestamp(), 

    Error: new EmbedBuilder()
        .setTitle(`${iconError} ERROR`)
        .setColor(colorError)
        .setTimestamp(), 

    Info: new EmbedBuilder()
        .setTitle('INFO')
        .setColor(colorInfo)
        .setTimestamp()
}

/*Add this to embedAbout.About
\`•\` [Privacy Policy](https://connect.deltagamez.ch/privacy)
\`•\` [Terms of Service](https://connect.deltagamez.ch/terms)
*/

const embedAbout = {
    About: new EmbedBuilder(embedInfo.Info)
        .setTitle(`${iconConnect} CONNECT`)
        .setDescription(`Connect your community to the best advertising platform for Discord communities. Connect is an easy to use Discord Bot, filled with features for partnerships, advertising and more.\n\u200B`)
        .addFields(
            { name: 'CONNECT', value: `\`•\` [Connect Web](https://connect.deltagamez.ch/) \n\`•\` [Discord Community Support](https://discord.gg/sYpmUFQ) \n\`•\` [Connect Discord Server](https://discord.gg/bJ8EPmdnrC)`, inline: true },
            { name: `LEGAL`, value: `\`•\` Privacy Policy \n\`•\` Terms of Service`, inline: true}, 
            { name: 'NOTE', value: `Please note we're still working on our legal information, create a ticket in our [Discord](https://discord.gg/sYpmUFQ) for any questions about your data and our terms. \n\u200B`})
        .setFooter(footerConnect),
    GetStarted: new EmbedBuilder(embedInfo.Success)
        .setTitle(`${iconSuccess} SUCCESSFULLY CONNECTED`)
        .setDescription(`Thanks for inviting <:DG_CO_ConnectBlack:1203623412271022150> **Connect**! \n\nConnect your community to the best advertising platform for Discord communities. Connect is an easy-to-use Discord Bot, perfected for small and large Discord communities, filled with features for partnerships, advertising and more. \n\u200B`)
        .addFields( 
            { name: `COMMUNITY INFORMATION`, value: `Connect uses only minimal commands to get you where you want to be. Here are the commands to help you get started. \n\n\`/connect\` • Advertise your community on the Connect [web-platform](https://connect.deltagamez.ch). \n\`/partnership\` • Manage partnerships inside your community. \n\`/about\` • Learn more about us, our terms and privacy policy. \n\`/serverinfo\` • Get information about your community. \n\n[Join our Discord](https://discord.gg/sYpmUFQ) for more help, updates, and our road-map. \n\u200B`})
        .setFooter(footerConnect),
    ServerInfo: async function ServerInfo(serverData, guild){

        if(!serverData.exists){
            serverData.server = {
                Connect: false,
                PartnerShip: false,
                Premiumlevel: 0
            }
        }

        const guildName = guild.name.toUpperCase();
        const date = Math.floor(guild.createdTimestamp / 1000);
        let connectPlus = `${iconDisable} (Free)`
        if(serverData.server.Premiumlevel && serverData.server.Premiumlevel == 1){
            connectPlus = `${iconSuccess} (Plus)`
        }

        let embed = new EmbedBuilder(embedInfo.Info)
            .setTitle(`${guildName} INFORMATION`)
            .setDescription(`Information about your community.\n\u200B`)
            .setThumbnail(guild.iconURL() ? `${guild.iconURL()}` : null)
            .addFields(
                { name: `GUILD ID`, value: `${guild.id}`, inline: true },
                { name: `MEMBERS`, value: `${guild.memberCount}`, inline: true },
                { name: `${iconBoost} BOOSTERS`, value: `\u200B ${guild.premiumSubscriptionCount}\n`, inline: true },
                { name: `OWNER`, value: `<@${guild.ownerId}>`, inline: true },
                { name: `CREATED`, value: `<t:${date}:D>`, inline: true },
                { name: `\u200B`, value: `\u200B\n\u200B`, inline: true }, 
                { name: `MODULES`, 
                    value: `${serverData.server.Connect ? `${iconSuccess}` : `${iconDisable}`} \`•\` \`/connect\` \n${serverData.server.PartnerShip ? `${iconSuccess}` : `${iconDisable}`} \`•\` \`/partnership\`\n\u200B`, inline: false },
                { name: `CONNECT PLUS`, value: `${connectPlus} \n\u200B`, inline: true }
            )
            .setFooter(footerConnect)
        return embed;
    }
}

const embedConnect = {
        ModuleInfo : async function ModuleInfo(status, server){
            let guildName = server.ServerName.toUpperCase();
            let embed = new EmbedBuilder(embedInfo.Info)
                .setTitle(`${iconConnect} CONNECT`)
                .setDescription(`Connect your community to the best advertising platform for Discord communities. \n\nThis module allows your community to be displayed on the [Connect web-platform](https://connect.deltagamez.ch). Through the platform, you can display your community to the web, for everyone to view and join. \n\nUse the buttons below to enable or disable the module and enter your community description, we will fetch your community data and get you online. [Learn about how it works](https://connect.deltagamez.ch/features/#connect)
                    \u200B 
                    `)

            if (server.Connect) {
                embed.addFields( 
                    { name: 'COMMUNITY INFORMATION', 
                    value: `**NAME**: ${guildName} \n**DESCRIPTION**: ${server.ShortDesc} \n**MEMBERS**: ${server.MemberCount} \n**INVITE**: ${server.ServerInvite}\n\u200B`})
            }
            embed.addFields({ name: `MODULE STATUS`, value: `${status ? `${iconSuccess} \`Enabled\`` : `${iconDisable} \`Disabled\``}\n\u200B` })
            embed.setFooter(footerConnect)

        return embed
    },
    Edited: async function Edited(server){
        let guildName = server.ServerName.toUpperCase();
        let embed = new EmbedBuilder(embedInfo.Success)
            .setTitle(`${iconSuccess} DESCRIPTION UPDATED`)
            .setDescription(`Your community description has successfully been updated and will soon be displayed on (Connect)[https://connect.deltagamez.ch/]. \n\u200B`)
            .addFields( 
                { name: 'COMMUNITY INFORMATION', 
                    value: `**NAME**: ${guildName} \n**DESCRIPTION**: ${server.ShortDesc} \n**MEMBERS**: ${server.MemberCount} \n**INVITE**: ${server.ServerInvite}\n\u200B`})
            .setFooter(footerConnect)

        return embed;
    },
    StatusChange: async function StatusChange(status, server){
        let guildName = server.ServerName.toUpperCase();
        let embed = new EmbedBuilder(embedInfo.Success)
            .setTitle(`${iconSuccess} CONNECT ${status ? 'ENABLED' : 'DISABLED'}`)
            .setDescription(`The Connect module has successfully been ${status ? 'enabled' : 'disabled'}. \nCheck which modules are enabled, by using \`/serverinfo\`.\n\u200B`)
            .setFooter(footerConnect)
        if (server.Connect) {
            embed.addFields( 
                { name: 'COMMUNITY INFORMATION', 
                value: `**NAME**: ${guildName} \n**DESCRIPTION**: ${server.ShortDesc} \n**MEMBERS**: ${server.MemberCount} \n**INVITE**: ${server.ServerInvite}\n\u200B`})
        }
        return embed
    },
    Error: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} ERROR`)
        .setDescription('Error performing this task. Please try again later.\n\u200B')
        .setFooter(footerConnect),
    OutsideServer: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription(`You need to be in a server to use this command.\n\u200B`)
        .setFooter(footerConnect),
    ServerOwner: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} ${messageErrorPermission}`)
        .setDescription(`Only the server owner can run this command. Please contact the server owner to use this command.\n\u200B`)
        .setFooter(footerConnect),
    ModalProcess: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription(`An error occurred while processing your form. \nPlease try again later.\n\u200B`)
        .setFooter(footerConnect),
    Process: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription(`An error occurred while processing your request. \nPlease try again later.\n\u200B`)
        .setFooter(footerConnect),
    ErrorDatabase: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription(`Database could not be reached. \nPlease try again later or contact support.\n\u200B`)
        .setFooter(footerConnect),
};


const embedPartnership = {
    ModuleInfo : async function ModuleInfo(status, server){
        let embed = new EmbedBuilder(embedInfo.Info)
            .setTitle(`${iconConnect} PARTNERSHIPS`)
            .setDescription(`Connect your community to other communities across Discord. \n\nThis module allows your users to easily create partnership requests and lets your staff handle them with ease. Users can view your member requirements, and for new requests your selected staff will automatically be pinged. \n\nUse the buttons below to enable or disable the module and walk-through the setup, we will do the rest and set it up for you. [Learn about how it works](https://connect.deltagamez.ch/features/#partnerships)\n\u200B`)
            .setThumbnail(iconURLCommunity)
            .addFields({ name: `MODULE STATUS`, value: `${status ? `${iconSuccess} \`Enabled\`` : `${iconDisable} \`Disabled\``}\n\u200B` })
            .setFooter(footerPartnership)

        return embed
    },
    StatusChange : async function StatusChange(status){
        const StatusChange = new EmbedBuilder(embedInfo.Success)
            .setTitle(`${iconSuccess} PARTNERSHIPS ${status ? 'ENABLED' : 'DISABLED'} `)
            .setDescription(`The Partnership module has sucessfully been ${status ? 'enabled' : 'disabled'}. \nCheck which modules are enabled, by using \`/serverinfo\`.\n\u200B`)
            .setThumbnail(iconURLCommunity)
            .setFooter(footerPartnership);
        return StatusChange;
    },
    ChannelSelection: new EmbedBuilder(embedInfo.Info)
        .setTitle(`CHANNEL SELECTION`)
        .setDescription(`Select the channel users can create a partnership request in.\n\u200B`)
        .setThumbnail(iconURLCommunity)
        .addFields({ name: `HOW IT WORKS`, 
            value: `Users can create a partnership request through pressing the \`Request Partnership\` button. \nWe suggest your selected channel is called \`#request-partnership\` and make sure it is public to \`@everyone\`. \nWe will post the message, in which users can request a partnership with you.\n\u200B` })
        .setFooter(footerPartnership),
    RoleSelection: new EmbedBuilder(embedInfo.Info)
        .setTitle(`ROLE SELECTION`)
        .setDescription(`Select the roles which should be mentioned for new partnership requests.\n\u200B`)
        .setThumbnail(iconURLCommunity)
        .addFields({ name: `HOW IT WORKS`, 
            value: `As soon as someone requests a new partnership, your selected roles will be mentioned. A thread is created for your staff to approve or decline a partnership request.\n\u200B` })
        .setFooter(footerPartnership),
    MemberRequirementSelection: new EmbedBuilder(embedInfo.Info)
        .setTitle(`MEMBER REQUIREMENTS`)
        .setDescription(`Select the minimum members a community needs to partner with you.\n\u200B`)
        .setThumbnail(iconURLCommunity)
        .addFields({ name: `HOW IT WORKS`, 
            value: `As soon as someone requests a new partnership, your selected roles will be mentioned. A thread is created for your staff to approve or decline a partnership request.\n\u200B` })
        .setFooter(footerPartnership),
    CustomQuestionsSelection: new EmbedBuilder(embedInfo.Info)
        .setTitle(`CUSTOM QUESTIONS`)
        .setDescription(`Select if you want to use custom questions for partnership module.\n\u200B`)
        .addFields({ name: `HOW IT WORKS`,
            value: `You can add custom questions to the partnership request. This can be used to get more information from the requester.\n\u200B` },
        { name: `DEFAULT`, value: `The default questions are:\nWhat is the community name?\nWhat is your member count?\nWhat is your community about?\nCan you provide a Discord invite?"`})
        .setFooter(footerPartnership),   
    PartnershipRequest: async function PartnershipRequest(memberRequirement, roleMention, interactionGuild, questions){
        // questions is a array of questions from Custom Questions
        // interactionGuild.iconURL() will give the guild icon
        let addFields = ``;
        let PartnershipEmbed = new EmbedBuilder(embedInfo.Info)
            .setTitle(`REQUEST A PARTNERSHIP`)
            .setDescription(`We are currently accepting partnership requests! \nCreate a new partnership request through pressing the button below.\n\u200B`)
            .setThumbnail(iconURLCommunity)
            .setFooter(footerPartnership)
        if (memberRequirement) {
            if(memberRequirement == 'none'){
                memberRequirement = 'None';
            }
            addFields += `\n**MINIMUM MEMBERS**: ${memberRequirement}`;}
        if (roleMention) {
            addFields += `\n**PARTNERSHIP HANDLER**: ${roleMention}`;}
        if (memberRequirement || roleMention){
            PartnershipEmbed.addFields( { name: 'REQUEST INFO', value: `${addFields}\n\u200B`})}

        return PartnershipEmbed;
    },
    PartnershipRequester: async function PartnershipRequester(channel, enable, memberRequirement, roleMention, questions){
        // Enable is true if the partnership module is enabled, False if edited
        // questions is a array of questions from Custom Questions
        
        let embed = new EmbedBuilder(embedInfo.Success)
            .setTitle(`${iconSuccess} PARTNERSHIPS ENABLED`)
            .setDescription(`The partnerships module has successfully been enabled, and was sent to <#${channel}>.\n\u200B`)
            .setThumbnail(iconURLCommunity)
            .setFooter(footerPartnership)
        return embed
    },
    PartnershipAccepted: async function PartnershipAccepted(user){
        if (!user) {
            const embed = new EmbedBuilder(embedInfo.Success)
                .setTitle(`${iconSuccess} PARTNERSHIP ACCEPTED`)
                .setDescription(`Your partnership request has been accepted. \n\n*Note for Staff: The user couldn't be found, and hasn't been pinged. Please mention the user manually.*`)
                .setThumbnail(iconURLCommunity)
                .setFooter(footerPartnership)
            return embed
        }
        
        const embed = new EmbedBuilder(embedInfo.Success)
            .setTitle(`${iconSuccess} PARTNERSHIP ACCEPTED`)
            .setDescription(`<@${user.user.id}>, your partnership has been accepted. Please wait for further instructions by the staff team to complete the partnership.\n\u200B`)
            .setThumbnail(iconURLCommunity)
            .setFooter(footerPartnership)
        return embed
    },
    RequestThread: async function RequestThread(serverData, questionsAnswers){ 

        const embed = new EmbedBuilder(embedInfo.Info)
            .setTitle(`${iconConnect} PARTNERSHIP REQUEST`)
            .setDescription(`Thanks for requesting a partnership. Before we can accept your partnership, please answer the questions below.\n\u200B`)
            .setFooter(footerPartnership)

        if(serverData.server.PartnerShipQuestions != "null"){
            if(questionsAnswers.length > 0){
                let value = ""
                for (let question of questionsAnswers) {
                    value = value + `\`•\` ${question.question} - ${question.answer}\n`
                }
        
                if(value != "") {
                    embed.addFields({ name: `QUESTIONS`, value: value })
                }
            }
        }

        return embed
    },
    RequestPending: async function RequestPending(existingThread){
        const embed = new EmbedBuilder(embedInfo.Warn)
            .setTitle(`${iconWarn} PARTNERSHIP PENDING`)
            .setDescription(`Your partnership request has already been sent and is pending. You will be mentioned as soon as a staff member handles your request. \n\n**YOUR REQUEST**: [View Request](${existingThread.url})\n\u200B`)
            .setThumbnail(iconURLCommunity)
            .setFooter(footerPartnership)
        return embed
    },
    RequestSuccess: async function RequestSuccess(url){
        const embed = new EmbedBuilder(embedInfo.Success)
            .setTitle(`${iconSuccess} PARTNERSHIP REQUESTED`)
            .setDescription(`Your partnership request has successfully been sent. Please open the request below and provide us with more information about your request. \n\n**YOUR REQUEST**: [View Request](${url})\n\u200B`)
            .setThumbnail(iconURLCommunity)
            .setFooter(footerPartnership)
        return embed
    },

    RequestDeclineReason: async function RequestDeclineReason(reason){
        const embed = new EmbedBuilder(embedInfo.Error)
            .setTitle(`${iconDisable} PARTNERSHIP DECLINED`)
            .setDescription(`We are sorry to let you know that your partnership request has been declined. \n\n**REASON**: ${reason}\n\u200B`)
            .setThumbnail(iconURLCommunity)
            .setFooter(footerPartnership)
        return embed
    },
    RequestDisabled: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} PARTNERSHIPS DISABLED`)
        .setDescription(`We are sorry, but we are currently not accepting any partnership requests.\n\u200B`)
        .addFields({ name: `STAFF INFO`, value: `If you are the community owner, use \`/partnership\` to re-enable partnership requests.\n\u200B`})
        .setFooter(footerPartnership),
    ButtonApproveDeclinePermission: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} PERMISSION ERROR`)
        .setDescription(`You do not have the required permissions to use this Button. \n\nPlease ask the Staff Team to Approve/Decline the Partnership Request. \nStaff Members require the \`Manage Messages\` permission to handle requests.`)
        .setFooter(footerPartnership),
    RequestAlreadyDeclined: new EmbedBuilder(embedInfo.Info)
        .setTitle(`${iconDisable} PARTNERSHIP DECLINED`)
        .setDescription(`This Partnership Request has already been declined.\n\u200B`)
        .setFooter(footerPartnership),
    RequestAlreadyAccepted: new EmbedBuilder(embedInfo.Info)
        .setTitle(`${iconSuccess} PARTNERSHIP ACCEPTED`)
        .setDescription(`This Partnership Request has already been accepted.\n\u200B`)
        .setFooter(footerPartnership),
    AddRemoveQuestions: async function AddRemoveQuestions(questions){
        questions = questions.map((question, index) => `**${index+1}**: ${question}`).join('\n');

        const embed = new EmbedBuilder()
                .setTitle('Question')
                .setDescription(`Do you want to add more or are you done?\n${questions}`)
                .setFooter(footerPartnership);

            return embed;
    },
    removeEmbed: async function removeEmbed(questions){
        questions = questions.map((question, index) => `**${index+1}**: ${question}`).join('\n');

        const embed = new EmbedBuilder()
                .setTitle('Question')
                .setDescription(`Select the question you want to remove.\n${questions}`)
                .setFooter(footerPartnership);

            return embed;
    },

    // ERRORS
    ErrorServer: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription('You need to be in a server to use this.\n\u200B')
        .setFooter(footerPartnership),
    ErrorServerOwner: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} ${messageErrorPermission}`)
        .setDescription('Only the server owner can run this command.\n\u200B')
        .setFooter(footerPartnership)
}

// Staff Management Embeds
const embedManage = {
    Management: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Please pick a Subcategory`)
        .setDescription('These are the subcategories you can pick from.')
        .setFields(
            {name: 'Staff Leave', value: 'Staff Leave can help manage staff going on holiday etc.'},
            {name: 'Promotion', value: 'Promotion is for helping u promote/demote staff members and keeping a log of these actions'}
        ),
    Promotion: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Promotion`)
        .setDescription(`This is Promotion\nThis is for coolio people`),
    PromotionDisabled: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Promotion`)
        .setDescription(`This has been disabled`),
    PromotionEdit: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Promotion`)
        .setDescription(`This has been Edited`),
    PromotionEnabled: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Promotion`)
        .setDescription(`This has been Enabled`),
    StaffLeave: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Staff Leave`)
        .setDescription(`This is staff leave\nThis is for coolio people`),
    StaffLeaveDisabled: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Staff Leave`)
        .setDescription(`This has been disabled`),
    StaffLeaveEdited: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Staff Leave`)
        .setDescription(`This has been edited`),
    StaffLeaveEnabled: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Staff Leave`)
        .setDescription(`This has been enabled`),
    StaffLeavePost: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Staff Leave`)
        .setDescription(`This has been posted`),
    StaffLeaveReviewFormat: async function (interaction, StaffLeaveID){
        let data
        try {
            const response = await axios.get(
                `${process.env.DATABASE_URL}${process.env.STORAGE_PATH}/servers/staffmanagement/staffleave/${StaffLeaveID}`,{
                    timeout: 2500
                }
            );
    
            data = response.data.staffleave;
        } catch (error) {
            if(interaction.customId){
                await interaction.update({embeds: [embedConnect.ErrorDatabase], components: []})
            } else {
                await interaction.reply({embeds: [embedConnect.ErrorDatabase], components: []})
            }
            return;
        }
        let desc = ""
        if(data.UserID){
            desc += `User: <@${data.UserID}>\n`;
        }
        if(data.Reason){
            desc += `Reason: ${data.Reason}\n`;
        }
        if(data.StartDate && !data.EndDate){
            const startTimestampInSeconds = Math.floor(new Date(data.StartDate).getTime() / 1000);
            desc += `Start Date: <t:${startTimestampInSeconds}:D>\n`;
        }
        if (data.EndDate && !data.StartDate) {
            const endTimestampInSeconds = Math.floor(new Date(data.EndDate).getTime() / 1000);
            desc += `End Date: <t:${endTimestampInSeconds}:D>\n`;
        }
        if(data.StartDate && data.EndDate){
            const startTimestampInSeconds = Math.floor(new Date(data.StartDate).getTime() / 1000);
            const endTimestampInSeconds = Math.floor(new Date(data.EndDate).getTime() / 1000);
            const durationInSeconds = endTimestampInSeconds - startTimestampInSeconds;
            const durationInDays = Math.floor(durationInSeconds / 86400); // Convert seconds to days
            desc += `Duration: <t:${startTimestampInSeconds}:R> to <t:${endTimestampInSeconds}:R>\n`;
            desc += `This is a total of ${durationInDays} days\n`; // Display total duration in days
        }
        if(data.Status){
            desc += `Status: ${data.Status}\n`;
        }
        if(data.ApprovedBy){
            desc += `${data.Status == "Approved" ? "Approved" : "Declined"} By: <@${data.ApprovedBy}>\n`;
        }
        if(data.ApprovedDate){
            const approvedTimestampInSeconds = Math.floor(new Date(data.ApprovedDate).getTime() / 1000);
            desc += `${data.Status == "Approved" ? "Approved" : "Declined"} Date: <t:${approvedTimestampInSeconds}:D>\n`;
        }
        if(data.DeclineReason !== "No Reason Provided"){
            desc += `Decline Reason: ${data.DeclineReason}\n`;
        }


        let embed = new EmbedBuilder(embedInfo.Info)
            .setTitle(`Staff Leave`)
            .setDescription(desc)
            .setFooter({text: `Staff Leave ID: ${data.StaffLeaveID}`})
        return embed
    },
    StaffLeaveSubmitted: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Staff Leave`)
        .setDescription(`your Staff Leave Request has been submitted`),
    StaffLeaveApproved: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Staff Leave`)
        .setDescription(`You have approved this Staff Leave Request`),
    StaffLeaveDeclined: async function StaffLeaveDeclined(reason){
        let embed = new EmbedBuilder(embedInfo.Info)
            .setTitle(`Staff Leave`)
            .setDescription(`You have declined this Staff Leave Request for ${reason}.`)
        return embed
    },
    // The channel that the Staff Leaves get posted to
    channelSelect: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Channel Select`)
        .setDescription(`Select a Channel to post the Staff Leave Requests in for review.`),
    // The channel that the button to request staff leave gets posted in
    postChannelSelect: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Post Channel Select`)
        .setDescription(`Select a Channel to post the Staff Leave Requests in for review.`),
    selectManageRoles: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Select Management Roles`)
        .setDescription(`Select the roles that can manage staff leave requests.`),
    selectModeraterRoles: new EmbedBuilder(embedInfo.Info)
        .setTitle(`Select Moderation Roles`)
        .setDescription(`Select the roles that can moderate staff leave requests.`),
    StaffChannelNotFound: new EmbedBuilder(embedInfo.Error)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription(`The Staff Leave Channel could not be found.`),
};


// These embeds are out of date, refactor code into respective modules. Embeds outside of module should use embedConnect. ...
// Info Error Embeds
const embedInfoErrorTemplate = new EmbedBuilder().setColor(colorError).setFooter({ text: "Connect" });
const embedInfoError = {
    Template: embedInfoErrorTemplate,
    ServerError: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription('You need to be in a server to use this!'),
    ServerOwner: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} 'ERROR'`)
        .setDescription('Only the server owner can run this command.'),
    ModalProcess: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription(
            `An error occurred while processing your form. Please try again later.`,
        ),
    Process: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription(`An error occurred while processing your request.
            Please try again later.`,
        ),
    ServerConnectionError: new EmbedBuilder(embedInfoErrorTemplate)
        .setTitle(`${iconError} ${messageErrorServer}`)
        .setDescription(`Database could not be reached.
            Please try again later or contact support.`,
        ),
};


// Exporting Embeds
module.exports = {
    embedLog,
    embedInfo,
    embedConnect,
    embedPartnership,
    embedManage,
    embedInfoError,
    embedAbout,
    messageButtonTimeout
};
