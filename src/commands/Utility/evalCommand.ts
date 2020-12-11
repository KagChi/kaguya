import type { Message } from "discord.js-light";
import { CommandConf } from "../../decorators";
import Command from "../../structures/Command";

@CommandConf({ 
    name: "eval",
    aliases: ["e", "ev"],
    description: "",
    usage: "",
    cooldown: 3,
    ownerOnly: true
})
export default class evalCommand extends Command {
    public async exec(msg: Message, query: string[]): Promise<void> {
        try {
            const { args, flags } = this.client.util.parseQuery(query);
            if (!args.length) {
                throw new TypeError("Eval command cannot execute without input!. You bbbaka...");
              }
              let code = args.join(" ");
              let depth = 0;
              if (flags.includes("async")) {
                  code = `(async() => { ${code} })()`;
                }

                let { evaled, type } = await this.client.util.parseEval(eval(code)); /* eslint-disable-line */
                if (flags.includes("silent")) return;
                if (typeof evaled !== "string") evaled = require("util").inspect(evaled, { depth });
                evaled = evaled
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`);
                if (evaled.length > 2048) evaled = await this.client.util.hastebin(evaled);
                else evaled = `\`\`\`${evaled}\`\`\``;
                msg.channel.send(evaled);
        } catch (err) {
            function clean(text: string) {
              if (typeof(text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
              else
                  return text;
            }
            msg.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
          }
    }
}