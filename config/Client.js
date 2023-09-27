// config.js
const { Client, RemoteAuth, LocalAuth } = require('whatsapp-web.js'); // Substitua 'sua-lib-client' pelo nome real da sua biblioteca
// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

const client = async ()=>{
    // mongo = await mongoose.connect(process.env.MONGO_URI)
    //     const store = new MongoStore({ mongoose: mongoose });
    
    //     return new Client({
    //     authStrategy: new RemoteAuth({
    //         store: store,
    //         backupSyncIntervalMs: 300000
    //         })
    //     });
    return new Client({
        authStrategy: new LocalAuth()
    });
     
}

module.exports = client;