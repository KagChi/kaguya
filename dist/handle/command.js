"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const { join, resolve } = require("path");
const ascii = require("ascii-table");
const discord_js_1 = require("discord.js");
const Helps = new discord_js_1.Collection();
let table = new ascii("Commands");
table.setHeading("Command", "Load status");
exports.default = (client) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.readdirSync("./dist/commands/").forEach(dir => {
        const commands = fs_1.readdirSync(`./dist/commands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`).default;
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            }
            else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
            }
            if (pull.aliases && Array.isArray(pull.aliases))
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    console.log(table.toString());
});
