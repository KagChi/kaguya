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
  public chunk(array: string[], chunkSize: number) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
  }
  public filters: any = {
    bassboost: 'bass=g=20,dynaudnorm=f=200',
    '8D': 'apulsator=hz=0.08',
    vaporwave: 'aresample=48000,asetrate=48000*0.8',
    nightcore: 'aresample=48000,asetrate=48000*1.25',
    phaser: 'aphaser=in_gain=0.4',
    tremolo: 'tremolo',
    vibrato: 'vibrato=f=6.5',
    reverse: 'areverse',
    treble: 'treble=g=5',
    normalizer: 'dynaudnorm=f=200',
    surrounding: 'surround',
    pulsator: 'apulsator=hz=1',
    subboost: 'asubboost',
    karaoke: 'stereotools=mlev=0.03',
    flanger: 'flanger',
    gate: 'agate',
    haas: 'haas',
    mcompand: 'mcompand'
   }
}
