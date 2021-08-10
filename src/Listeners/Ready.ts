import { Listener } from 'discord-akairo';
export default class Ready extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      category: 'client',
      event: 'ready',
    });
  }

  async exec() {
      this.client.user?.setActivity({ name: `Music in ${this.client.guilds.cache.size} Guilds`, type: 'LISTENING' });
      console.log(`CLIENT READY | ${this.client.guilds.cache.size} GUILD(s) CACHED`)
  }
}