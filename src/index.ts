import nezukoClient from './handle/nezukoClient';
const client = new nezukoClient({
    disableMentions: 'everyone',
    cacheGuilds: true,
	cacheChannels: true,
	cacheOverwrites: false,
	cacheRoles: false,
	cacheEmojis: false,
	cachePresences: false,
	ws: { properties: { $browser: "Discord iOS" } }
});

require('./handle/musicEvent').default(client)
require(`./handle/cmdHandle`).default(client)
require('./handle/event').default(client)
require('./handle/mongoConnect')
client.login(client.config.token);
