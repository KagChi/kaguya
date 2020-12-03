import nezukoClient from './handle/nezukoClient';
const client = new nezukoClient({disableMentions: 'everyone'});
require(`./handle/cmdHandle`).default(client)
require('./handle/event').default(client)
client.login(client.config.token);
