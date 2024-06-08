const disableCommandForGuild = require("./disableCommandForGuild.js");
const enableCommandForGuild = require("./enableCommandForGuild.js");
const sendMenuBuilders = require("./sendMenuBuilders.js");
const updateServer = require("./updateServer.js");
const YesNoOption = require("./YesNoOption.js");
const enableDisablePrompt = require("./enableDisablePrompt.js");
const createServer = require("./createServer.js");
const getServer = require("./getServer.js");

module.exports = {
        "disableCommandForGuild": disableCommandForGuild,
        "enableCommandForGuild": enableCommandForGuild,
        "sendMenuBuilders": sendMenuBuilders,
        "updateServer": updateServer,
        "YesNoOption": YesNoOption,
        "enableDisablePrompt": enableDisablePrompt,
        "createServer": createServer, 
        "getServer": getServer
    };