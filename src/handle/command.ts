import  { readdirSync, statSync } from 'fs';
const { join, resolve } = require("path");
import * as ascii from 'ascii-table';
import { Collection } from 'discord.js'

const Helps = new Collection();
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

export default async(client) => {
    readdirSync("./dist/commands/").forEach(dir => {
        const commands = readdirSync(`./dist/commands/${dir}/`).filter(file => file.endsWith(".js"));
       

        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`).default
     
             if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
           }
    
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    })
    console.log(table.toString())
   
        }
