import nezukoClient from './handle/nezukoClient';
const client = new nezukoClient({
    disableMentions: 'everyone',
    cacheGuilds: true,
	cacheChannels: false,
	cacheOverwrites: false,
	cacheRoles: false,
	cacheEmojis: false,
	cachePresences: false
});
require(`./handle/cmdHandle`).default(client)
require('./handle/event').default(client)
require('./handle/mongoConnect')
client.login(client.config.token);
