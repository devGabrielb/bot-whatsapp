const { writeFile, readFile,open,close, unlink } = require('fs');
const fs = require('fs/promises');
const type = '.json';

const createFile = async (fileName)=>{
    open(`data/${fileName}${type}`, 'wx', (err, fd) => {
        if (err) {
          console.log(err.message);
        }
      
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

        parsedData.push(...users.map(u => {return {id: u.id.user,serialized: u.id._serialized}}))

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
        let parsedData = [];
        
        if(listUsers.length > 0){
            parsedData  = JSON.parse(listUsers);
        }
        console.log(parsedData)
        return parsedData
}

module.exports = {createFile, addInList, getList, deleteFile}


