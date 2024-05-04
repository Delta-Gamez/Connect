# Tracked Changes
> Note: This does not include direct changes to the GitHub repository. If you are making changes, please pull them to a local machine first and edit them there. Then, write down the new version number and the changes that you have made.

## Versions

### 0.1.7 DEVELOPMENT
#### Changes Made:
- Removed uneeded code
- Logs get send to Logs DC Channel (configuirable in config.json)
- Beta Commands support allows Developers to mark a command as "Beta" in the config.json and then it will only show that command in the betaserver also changeable in config.json
- Statues and Statues Type has been moved into config.json
- Started work on Partnership module

### 0.1.6 DEVELOPMENT
#### Changes Made:
- Changed Config.Json to env variables
- Removed Signup and Login Command
- DISCORD_TOKEN
- DATABASE_URL 
- DATABASE_TOKEN
- STORAGE_PATH

### 0.1.5 DEVELOPMENT
#### Changes Made:
- Added Signup and Login Command
- Added Support for commands with AutoComplete
- Moved Events into seperate Event Scripts src/events
- Added Status to the Discord Bot (can be changed in the ready event)

### 0.1.4 DEVELOPMENT
#### Changes Made:
- Added a Event Handeler
- Added Support for commands with AutoComplete
- Moved Events into seperate Event Scripts src/events
- Added Status to the Discord Bot (can be changed in the ready event)

### 0.1.3 DEVELOPMENT
#### Changes Made:
- Refactor code for improved performance.
- File reorganision
- Cleaned up files
- Added all Embeds (embed.js)
- Added a config.json instead of process var
- Fixed signup label limit
#### Changes Needed:
- Add file logging to src/log.js

### 0.1.2 DEVELOPMENT
#### Changes Made:
- Fixed modal error "Invalid Label Length"
- Changed [CHANGES.md](./CHANGES.md) from past-tense to present-tense.

### 0.1.1 DEVELOPMENT
#### Changes Made:
- Remove uneeded dependencies
- Add Commands to make code more understandable
- Change signup command, So it displays a diffrent error if it is used outside of a server
- Refactor !(x == y) to x !== y
- Add Date Stamps to Logs, etc
#### Changes Needed:
- Add file logging to src/log.js

### 0.1.0 DEVELOPMENT
#### Changes Made:
- Update signup modal's data submission script.
- Add signup modal configuration.
- Add [CHANGES.md](./CHANGES.md)
- Modify limit notifier's dialog to use correct timeout variable.
- Fix Syntax (such as adding ";", etc.).
#### Changes Needed:
- Add file logging to src/log.js
