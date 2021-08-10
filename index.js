/* eslint global-require: "off" */
const http = require('http');
require('dotenv').config();
const { execSync } = require("child_process");
const GLitch = (process.env.PROJECT_DOMAIN !== undefined
  && process.env.PROJECT_INVITE_TOKEN !== undefined
  && process.env.API_SERVER_EXTERNAL !== undefined
  && process.env.PROJECT_REMIX_CHAIN !== undefined);
const Replit = (process.env.REPLIT_DB_URL !== undefined);
function initialize(glitch = false, replit = false) {
  if (glitch) {
    console.log('[GLITCH ENVIRONMENT DETECTED] [STARTING WEBSERVER]');
    http.createServer((req, res) => {
      const now = new Date().toLocaleString('en-US');
      res.end(`OK (200) - ${now}`);
    }).listen(3000);
    console.log('[GLITCH ENVIRONMENT DETECTED] [COMPILING PROJECT]');
    execSync("npm run build");
    require('./dist/Client');
  } if (replit) {
    console.log('[REPLIT ENVIRONMENT DETECTED] [STARTING WEBSERVER]');
    http.createServer((req, res) => {
      const now = new Date().toLocaleString('en-US');
      res.end(`OK (200) - ${now}`);
    }).listen(3000);
    console.log('[REPLIT ENVIRONMENT DETECTED] [COMPILING PROJECT]');
    execSync("npm run build");
    require('./dist/Client');
  } else {
    console.log('[COMPILING PROJECT]');
    execSync("npm run build");
    require('./dist/Client');
  }
}

initialize(GLitch, Replit);