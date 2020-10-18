import  { readdirSync, statSync } from 'fs';
const { join, resolve } = require("path");
import * as ascii from 'ascii-table';
import { Collection } from 'discord.js'

export default async(client) => {

    const modules = readdirSync("./dist/commands/")
  .filter(x => statSync(join("./dist/commands", x)).isDirectory());

    for (const module of modules) {
        console.log(`Loading ${module} module.....`);
        const moduleConf = require(`../commands/${module}/module.json`);
        moduleConf.path = `./dist/commands/${module}`;
        moduleConf.cmds = [];
        client.helps.set(module.toLowerCase(), moduleConf);
        const commandFiles = readdirSync(resolve(`./dist/commands/${module}`))
        .filter(x => !statSync(resolve("./dist/commands/", module, x)).isDirectory())
        .filter(x => x.endsWith(".js"));
    
      for (let file of commandFiles) {
        file = file.substr(0, file.length - 3);
        console.log(`Loading ${file} command.....`);
    
       let files = require(`../commands/${module}/${file}`).default
       client.helps.get(module.toLowerCase()).cmds.push(files.name);
      }    
}
}
