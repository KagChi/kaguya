import { Client } from "discord.js-light";
import brainly from 'brainly-scraper-v2'
import type brainlyCountry from 'brainly-scraper-v2'
export default class Utility {
   public constructor(public readonly client : Client){}

   public async brainLess(query: string, length=5, country="id") {
    const data = await brainly(query, length, country)
    return data
   }
}
