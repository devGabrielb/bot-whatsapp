const { writeFile, readFile,open,close, unlink } = require('fs');
const fs = require('fs/promises');
const type = '.json';

const createFile = async (fileName, argument)=>{
    open(`data/${fileName}${type}`, 'wx', (err, fd) => {
        if (err) {
          console.log(err.message);
        }

        let defaultFile = {
          title: "",
          users: []
        }
        if(argument.length > 0){
          defaultFile.title = argument
        }
        writeFile(`data/${fileName}${type}`, JSON.stringify(defaultFile, null, 2), (err) => {
          if (err) {
            console.log('Failed to write updated data to file');
            return;
          }
          console.log('Updated file successfully');
        });
        close(fd, err => {
          if (err) {
            console.log(err.message);
          }
        });
      });

}

const deleteFile = async (fileName)=>{
    unlink(`data/${fileName}${type}`, (err) => {
        if (err) {
          console.log(err.message);
          return;
        }
      
        console.log("Sucesso ao deletar")
      });

}

const addInList = async (fileName, users)=>{

    readFile(`data/${fileName}${type}`, (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        let parsedData = [];
        console.log(data)
        if(data.length > 0){
            parsedData  = JSON.parse(data);
        }

        parsedData.users.push(...users.map(u => {return {id: u.id.user,serialized: u.id._serialized}}))

        writeFile(`data/${fileName}${type}`, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
            console.log('Failed to write updated data to file');
            return;
          }
          console.log('Updated file successfully');
        });
      });
}

const getList = async (fileName)=>{
     const listUsers = await fs.readFile(`data/${fileName}${type}`);
        let parsedData = {};
        
        if(listUsers.length > 0){
            parsedData  = JSON.parse(listUsers);
        }
        console.log(parsedData)
        return parsedData
}

const getRulesList = async (sender)=>{
  let parsedData = [];
  
  try {
    
    const listUsers = await fs.readFile(`data/${sender}${type}`);
    parsedData  = JSON.parse(listUsers);
  } catch (error) {
    
    writeFile(`data/${sender}${type}`, JSON.stringify([], null, 2), (err) => {
      if (err) {
        console.log('erro recuperar regras');
        return;
      }
      console.log('regras retornadas com sucesso');
    });
    close(fd, err => {
      if (err) {
        console.log(err.message);
      }
    });

  }finally{
    return parsedData;
  }
 
}

const addRule = async (sender, rule)=>{

  readFile(`data/${sender}${type}`, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      let parsedData = [];
      console.log(data)
      if(data.length > 0){
          parsedData  = JSON.parse(data);
      }

      parsedData.push(rule)

      writeFile(`data/${sender}${type}`, JSON.stringify(parsedData, null, 2), (err) => {
        if (err) {
          console.log('Failed to write updated data to file');
          return;
        }
        console.log('Updated file successfully');
      });
    });
}

const editRule = async (sender, rule)=>{

  readFile(`data/${sender}${type}`, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      let parsedData = [];
      console.log(data)
      if(data.length > 0){
          parsedData  = JSON.parse(data);
      }
      let ruleData = {number:rule.split(" ")[0], data: rule.substring(rule.indexOf(" ")).trim()}
      parsedData[parseInt(ruleData.number-1)] = ruleData.data

      writeFile(`data/${sender}${type}`, JSON.stringify(parsedData, null, 2), (err) => {
        if (err) {
          console.log('Failed to write updated data to file');
          return;
        }
        console.log('Updated file successfully');
      });
    });
}

module.exports = {createFile, addInList, getList, deleteFile, getRulesList, addRule, editRule}


