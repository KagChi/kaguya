import { Client, MessageEmbed } from 'discord.js-light';
import axios from 'axios';
export default class Utility {
   public constructor(public readonly client : Client){}
   public color: string = "EE2677"
   public embed = () => new MessageEmbed()
   public async hastebin(text: string){
     const { data } = await axios.post('https://bin.nezukochan.xyz/documents', { payload: text })
       return `https://bin.nezukochan.xyz/${data.key}.js`
      } 
   public parseQuery(queries: string[]) {
    const args = [];
    const flags = [];
    for (const query of queries) {
      if (query.startsWith("--")) flags.push(query.slice(2).toLowerCase());
      else args.push(query);
    }
   return { args, flags };
  }   

  public async parseEval(input: any) {
    const isPromise =
      input instanceof Promise &&
      typeof input.then === "function" &&
      typeof input.catch === "function";
    if (isPromise) {
      input = await input;
      return {
        evaled: input,
        type: `Promise<${this.parseType(input)}>`
      };
    }
    return {
      evaled: input,
      type: this.parseType(input)
    };
  }
  public parseType(input: any) {
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
}
