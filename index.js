const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios')

const {createFile, addInList, getList, deleteFile} = require('./clientRepository');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', async  msg => {
    const command = msg.body.split(' ')[0];
    
    console.log(command)
    // Cola seu número onde tem o 84848484, sem o 9
    const sender = msg.from.includes("7488043170") ? msg.to : msg.from

    if (command === "!sticker")  generateSticker(msg, sender)
    if (command === "@brunawn")  msg.react("😉")
    if (command === "quem é vc")  msg.react("😉")
    if (command === "!balinha") {
        const chat = await msg.getChat();
        let gleisin = await client.getContactById("558774006609@c.us")
        await chat.sendMessage("Aí é com o famoso @"+gleisin.id.user+" 😉",{mentions: [gleisin]})
    }
    if(['@everyone','@todes','@here','@channel'].includes(command) ) everyOne(msg)
    if(command === "!create") createList(msg);
    if(command === "!add") {
        let fileName = msg.body.split(" ")[1]
        addUserInList(fileName,msg)
    };
    if(command === "!delete") {
        
        deleteList(msg)
    };
    if(command === "@go") {
        let fileName = msg.body.split(" ")[1]
        userMentions(fileName,msg)
    };



});

client.initialize();

const createList = async (msg)=>{
    try {
        const sender = msg.from.includes("7488043170") ? msg.to : msg.from
    createFile(msg.body.split(" ")[1])
    client.sendMessage(sender,"Lista Criada com Sucesso!")
    } catch (error) {
        msg.reply("❌ Erro ao criar lista")
    }

}

const deleteList = async (msg)=>{
    try {
        const sender = msg.from.includes("7488043170") ? msg.to : msg.from
    deleteFile(msg.body.split(" ")[1])
    client.sendMessage(sender,"Lista deletada com Sucesso!")
    } catch (error) {
        msg.reply("❌ Erro ao deletar lista")
    }

}

const userMentions = async (filename,msg)=>{
    
   try {
    const users = await getList(filename)
    const chat = await msg.getChat();

    const avaliableUsers = users.filter(x => chat.participants.some(d => d.id.user == x.id));
        
        let text = "";
        let mentions = [];

        for(let user of avaliableUsers) {
            const contact = await client.getContactById(user.serialized);
            
            mentions.push(contact);
            text += `@${contact.id.user} `;
        }

        await chat.sendMessage("Chamando todos os autobots 🤖 \n"+text, { mentions });
   } catch (error) {
        msg.reply("❌ Não foi possivel recuperar a lista")
   }
}

const addUserInList = async (filename,msg)=>{
    try {
        const users = await msg.getMentions();
        const sender = msg.from.includes("7488043170") ? msg.to : msg.from 
        addInList(filename, users)

        client.sendMessage(sender,`Dados adicionados com sucesso!`)
    } catch (error) {
        msg.reply("❌ Erro ao adicionar na lista")
    }
}

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
