  import { MessageEmbed } from 'discord.js';
const snek = require("node-superfetch");
export default {
  name: "eval",
  aliases: ["ev", "e"],
  cooldown: 2,
  guildOnly: true,
  description: "evaluate code",
  async execute(message, query, client) {
    try {
      if(message.author.id !== "499021389572079620") return;
     const { args, flags } = parseQuery(query);
    if (!args.length) {
      throw new TypeError("Eval command cannot execute without input!. You bbbaka...");
    }
    let code = args.join(" ");
    let depth = 0;
    if (flags.includes("async")) {
      code = `(async() => { ${code} })()`;
    }
    let { evaled, type } = await parseEval(eval(code)); /* eslint-disable-line */
    if (flags.includes("silent")) return;
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled, { depth });
    evaled = evaled
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`);
   
      function parseQuery(queries) {
  const args = [];
  const flags = [];
  for (const query of queries) {
    if (query.startsWith("--")) flags.push(query.slice(2).toLowerCase());
    else args.push(query);
  }
 return { args, flags };
}   
      async function parseEval(input) {
  const isPromise =
    input instanceof Promise &&
    typeof input.then === "function" &&
    typeof input.catch === "function";
  if (isPromise) {
    input = await input;
    return {
      evaled: input,
      type: `Promise<${parseType(input)}>`
    };
  }
  return {
    evaled: input,
    type: parseType(input)
  };
} 
      function parseType(input) {
  if (input instanceof Buffer) {
    let length = Math.round(input.length / 1024 / 1024);
    let ic = "MB";
    if (!length) {
      length = Math.round(input.length / 1024);
      ic = "KB";
    }
    if (!length) {
      length = Math.round(input.length);
      ic = "Bytes";
    }
    return `Buffer (${length} ${ic})`;
  }
  return input === null || input === undefined ? "Void" : input.constructor.name;
}

        async function hastebin(text) {
          const { body } = await snek.post("https://bin.nezukochan.xyz/documents")
            .send(text);
          return `https://bin.nezukochan.xyz/${body.key}`;
        }
        if (evaled.length > 2048) evaled = await hastebin(evaled);
        else evaled = `\`\`\`${evaled}\`\`\``;
     message.channel.send(evaled);
    } catch (err) {
      function clean(text) {
        if (typeof(text) === "string")
          return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
      }
      message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
  }
};