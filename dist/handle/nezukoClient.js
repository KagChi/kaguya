"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config = require("../config.json");
class nezukoClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.helps = new discord_js_1.Collection();
        this.color = "#fafcc2";
        this.commands = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.config = config;
    }
}
exports.default = nezukoClient;
