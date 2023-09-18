const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const jimp = require('jimp')
const axios = require('axios')

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', msg => {
    const command = msg.body.split(' ')[0];
    
    console.log(command)
    // Cola seu número onde tem o 84848484, sem o 9
    const sender = msg.from.includes("7488043170") ? msg.to : msg.from
    if (command === "!sticker")  generateSticker(msg, sender)
    if(['@everyone','@todes','@here','@channel'].includes(msg.body) ) everyOne(msg)

});

client.initialize();

const everyOne = async(msg)=> {
    const chat = await msg.getChat();
        
    let text = "";
    let mentions = [];

    for(let participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);
        
        mentions.push(contact);
        text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
}
const generateSticker = async (msg, sender) => {
    if(msg.type === "image") {
        try {
            console.log("msg: "+ msg)
            console.log("sender: "+ sender)
            const { data } = await msg.downloadMedia()
            console.log("data: " + data)
            const image = await new MessageMedia("image/jpeg", data, "image.jpg")
            console.log("image: "+image);
            await client.sendMessage(sender, image, { sendMediaAsSticker: true })
        } catch(e) {
            msg.reply("❌ Erro ao processar imagem")
        }
    } else {
        try {

            const url = msg.body.substring(msg.body.indexOf(" ")).trim()
            const { data } = await axios.get(url, {responseType: 'arraybuffer'})
            const returnedB64 = Buffer.from(data).toString('base64');
            const image = await new MessageMedia("image/jpeg", returnedB64, "image.jpg")
            await client.sendMessage(sender, image, { sendMediaAsSticker: true })
        } catch(e) {
            msg.reply("❌ Não foi possível gerar um sticker com esse link")
        }
    }
}
