/**
 * @name index.js
 * @description The Primary entry file for the "OwOifier" discord bot.
 * @author Luna
 * @version 2.0
 * @license MIT
*/
/////////////////////
// Imports
/////////////////////
const { Client, Intents } = require("discord.js");
const owoifyx = require("owoifyx");
require("dotenv").config();
const moment = require("moment");

/////////////////////
// Logger
/////////////////////
const date = moment().format('YYYY-MM-DD-HH-mm-ss');
const logger = require("./Logger/logger")(__dirname + `/logs/log-${date}.txt`);

/////////////////////
// Constant Vars
/////////////////////
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    allowedMentions: { 
        parse: ['users', 'roles'],
        repliedUser: false
    }
});
const TOKEN = process.env.TOKEN;
const OVERRIDE_CHAR = process.env.OVERRIDE;
const WHITELIST = ["136631672425807872"];
const BLACKLIST = [];
const BAD_WORDS = ["fuck", "shit", "bitch"];

/////////////////////
// Debug State
//! Do not use unless you know what you are doing. [Luna]
/////////////////////
const DEBUG_STATE = false;

/////////////////////
// Bot starts here
/////////////////////
client.on("ready", () => {
    logger.alert(`${client.user.username} | Online and ready`);
    client.user.setActivity("owo", { type: "PLAYING" });
    logger.log(`I am in ${client.guilds.cache.size} guilds.`);
});

client.on("disconnect", () => {
    logger.log("Disconnected...");
});

client.on("reconnecting", () => {
    logger.log("Reconnecting...");
});

client.on("error", e => {
    logger.error(e);
});

client.on("warn", w => {
   logger.warn(w);
});

client.on("debug", d => {
   if (DEBUG_STATE) {
       logger.debug(d);
   }
});

client.on("guildCreate", guild => {
    logger.log(`I joined ${guild.name} owned by ${guild.owner.user.username}`);
});

client.on("messageCreate", async message => {
    // Check certain values and return if needed
    if (message.author.bot | !message.guild) return;
    if (WHITELIST.includes(message.author.id)) return;
    if (BLACKLIST.includes(message.author.id)) return logger.alert(`${message.author.id}: ${message.author.username} is blacklisted and has attempted to use the bot!`);
    if (message.content.startsWith(OVERRIDE_CHAR)) return;
    if (message.content.startsWith("https://") || message.content.startsWith("http://")) return;
    if (message.content.endsWith(".gif")) return;
    if (message.attachments.size >= 1) return;
    if (message.mentions.members.cache >= 1) return;

    // Split message into 'args', determain size, and if it contains bad words, fix it.
    let args = message.content.toLowerCase().split();
    if (args.length >= 75) return logger.error(`${message.guild.name} | A message was to big for me to change. This is to prevent large text from being sent.`) & message.channel.send("Sowwy this was too long for me VnV");
    for (var i in BAD_WORDS) {
        if(args.includes(BAD_WORDS[i].toLowerCase())) return message.delete() & message.channel.send("Hey! Watch your language >_<");
    }

    // and finally, owoifies the text
    var start_text = message.content.toLowerCase();
    message.delete();
    let end_text = owoifyx(start_text);
    message.channel.send(`${message.author.username} > ${end_text}`);
});

client.login(TOKEN);