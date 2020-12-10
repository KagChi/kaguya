import Client from './structures/kaguyaClient';
import dotenv = require('dotenv');
dotenv.config();
const client = new Client();
client.run();