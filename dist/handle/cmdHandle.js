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
exports.default = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const modules = fs_1.readdirSync("./dist/commands/")
        .filter(x => fs_1.statSync(join("./dist/commands", x)).isDirectory());
    for (const module of modules) {
        console.log(`Loading ${module} module.....`);
        const moduleConf = require(`../commands/${module}/module.json`);
        moduleConf.path = `./dist/commands/${module}`;
        moduleConf.cmds = [];
        client.helps.set(module.toLowerCase(), moduleConf);
        const commandFiles = fs_1.readdirSync(resolve(`./dist/commands/${module}`))
            .filter(x => !fs_1.statSync(resolve("./dist/commands/", module, x)).isDirectory())
            .filter(x => x.endsWith(".js"));
        for (let file of commandFiles) {
            file = file.substr(0, file.length - 3);
            console.log(`Loading ${file} command.....`);
            let files = require(`../commands/${module}/${file}`).default;
            client.helps.get(module.toLowerCase()).cmds.push(files.name);
        }
    }
});
