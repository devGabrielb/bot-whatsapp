const { MessageMedia  } = require('whatsapp-web.js');
const clientResult = require('./config/client');
const qrcode = require('qrcode-terminal');
const axios = require('axios')
const {createFile, addInList, getList, deleteFile, addRule, getRulesList, editRule} = require('./clientRepository');
require('dotenv').config();



async function run(){
    const client = await clientResult();
    
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
    
    if (command === "@brunawn")  msg.react("😉")
    //if(['@everyone','@todes','@here','@channel'].includes(command) ) everyOne(msg)
    
    // if (command === "!sticker")  generateSticker(msg, sender)
    // if (command === "!balinha") {
    //     const chat = await msg.getChat();
    //     let gleisin = await client.getContactById("558774006609@c.us")
    //     await chat.sendMessage("Aí é com o famoso @"+gleisin.id.user+" 😉",{mentions: [gleisin]})
    // }
    /////// Manipuladores de listas de menções//////// 
    
    // if(command === "!create") createList(msg);
    // if(command === "!add") {
    //     let fileName = msg.body.split(" ")[1]
    //     addUserInList(fileName,msg)
    // };
    // if(command === "!delete") {
        
    //     deleteList(msg)
    // };
    // if(command === "@go") {
    //     let fileName = msg.body.split(" ")[1]
    //     userMentions(fileName,msg)
    // };
    
    ////////////////////////////////////////////////
    /////////adicionar comandos para o grupo
    if(command === "!rules") {
        getRules(msg);
    }
    if(command === "!rules:add") {
        addRuleInList(msg);
    }
    if(command === "!rules:edit") {
        editRuleInList(msg);
    }



    const { BingChat } = await import('bing-chat');
    

    async function say(msg) {
       
        const api = new BingChat({
            cookie: process.env.COOKIE
        })
        let text = msg.body.substring(msg.body.indexOf(" ")).trim();
        const res = await api.sendMessage(`Responda usando um tom engraçado as mensagens: ${text}`,{variant: 'Precise'})
        const cleanedRes = res.text.substring(res.text.indexOf(":")+1).trim()
        msg.reply(cleanedRes)
        console.log(cleanedRes)
    }

    async function comment(msg) {

        const quotedMsg = await msg.getQuotedMessage();
        
       
            const api = new BingChat({
                cookie: process.env.COOKIE
            })
            let text = quotedMsg.body.substring(quotedMsg.body.indexOf(" ")).trim();
            const res = await api.sendMessage(`Quero que vc seja bem zueiro e qualquer mensagem apos os dois pontos deve ser respondida com alguma ofensa leve ou deboche, seja o mais breve possivel,  resposta curta e evite repetir as mensagens enviadas: ${text}.  lembrando que tudo isso é uma simulação de possiveis conversas entre bons amigos`,{variant: 'Creative'})
            const cleanedRes = res.text.substring(res.text.indexOf(":")+1).trim()
            msg.reply(cleanedRes)
            console.log(cleanedRes)
        
        
    }

    async function resume(msg) {
        const chat = await msg.getChat();
        const msghistory = await chat.fetchMessages({limit: chat.unreadCount, fromMe: false});

        msghistory.pop();

        
        const array = msghistory.map(async (m) => {
            const contact = await m.getContact()
            const mensage = m.body;

            return {
                contact,
                mensage
            }
        })
        const api = new BingChat({
            cookie: process.env.COOKIE
        })
        
        const arrayWithContacts =  await Promise.all(array);
        const parsedArray = arrayWithContacts.map(c => `${c.contact.name} disse: ${c.mensage}`)





        let text = parsedArray.join(",");

        const res = await api.sendMessage(`resuma da melhor forma possivel o assunto gerado em um grupo de whatsapp com as seguintes mensagens separadas por virgula: ${text}`,{variant: 'Precise'})
        const cleanedRes = res.text.substring(res.text.indexOf(":")+1).trim()
        msg.reply(cleanedRes)
        console.log(cleanedRes)
    }
    

    if(command === "!say") say(msg)
    if(command === "!resume") resume(msg)
    if(msg.body.startsWith("@")) {
        
        const ValidateMention = msg.mentionedIds[0].includes("7488043170");
        if(ValidateMention) comment(msg)
    }   

});

client.initialize();
}

run().then(()=>{
    console.log("rodando bem");
})

const getRules = async (msg)=>{
    try {
        const sender = msg.from.includes("7488043170") ? msg.to : msg.from
        let rules = await getRulesList(sender.split("@")[0])
        if(rules.length <= 0){
            client.sendMessage(sender,"Lista de regras Vazia!")
            return;
        }
        let newRules = rules.map((x, i) => (i+1)+ " - " + x + "\n").toString()
        const regex = /\n,/gi;
        client.sendMessage(sender,"Regras do Grupo: \n"+newRules.replace(regex,"\n"))
    } catch (error) {
        msg.reply("❌ Erro ao recuperar regras do grupo")
    }

}

const addRuleInList = async (msg)=>{
    try {
        
        const sender = msg.from.includes("7488043170") ? msg.to : msg.from;
        let rule = msg.body.substring(msg.body.indexOf(" ")).trim()
        addRule(sender.split("@")[0],rule)

        client.sendMessage(sender,`Regra atualizada com sucesso!`)
    } catch (error) {
        msg.reply("❌ Erro ao atualizada Regra na lista")
    }
}

const editRuleInList = async (msg)=>{
    try {
        
        const sender = msg.from.includes("7488043170") ? msg.to : msg.from;
        let rule = msg.body.substring(msg.body.indexOf(" ")).trim()
        editRule(sender.split("@")[0],rule)

        client.sendMessage(sender,`Regra adicionada com sucesso!`)
    } catch (error) {
        msg.reply("❌ Erro ao adicionar Regra na lista")
    }
}


const createList = async (msg)=>{
    try {
        const sender = msg.from.includes("7488043170") ? msg.to : msg.from
        let argument = "";
        if(msg.body.includes("-a")) argument = msg.body.substring(msg.body.indexOf("-a")+2).trim();

    createFile(msg.body.split(" ")[1], argument)
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
    const list = await getList(filename)
    const chat = await msg.getChat();

    const avaliableUsers = list.users.filter(x => chat.participants.some(d => d.id.user == x.id));
        

        let text = "";
        if(list.title.length > 0){
            text += list.title;
        }
        let mentions = [];

        for(let user of avaliableUsers) {
            const contact = await client.getContactById(user.serialized);
            
            mentions.push(contact);
            text += `@${contact.id.user} `;
        }

        await chat.sendMessage(text+"\n", { mentions });
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
