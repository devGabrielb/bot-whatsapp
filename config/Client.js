// config.js
const { Client, LocalAuth } = require('whatsapp-web.js'); // Substitua 'sua-lib-client' pelo nome real da sua biblioteca

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] }
});

module.exports = client;