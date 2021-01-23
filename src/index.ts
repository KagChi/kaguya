import Client from './structures/kaguyaClient';
import dotenv = require('dotenv');
dotenv.config();
const client = new Client();
const app = require('express')()
app.get('/', function (req: any, res: any) {
  res.send('Hello World')
})
app.listen(3000)
client.run();
