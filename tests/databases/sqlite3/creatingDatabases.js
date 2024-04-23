const { Databases } = require("../../../databases")
const sqlite = require("../../../databases/sqlite3")
const dataclass = require("../../../dataclasses")
const utils = require("../../../utils")

class User extends dataclass.DataClass{
    getName(){return "users"}
    username = sqlite.createField(sqlite.types.TEXT,false)
    password = sqlite.createField(sqlite.types.TEXT,false)
}

class Comments extends dataclass.DataClass{
    getName(){return "user_comments"}
    comment = sqlite.createField(sqlite.types.TEXT)
    userID = sqlite.createRelationField(User,"_id")
}


const database  = new sqlite.SQLiteDatabase(process.cwd() + "\\tests\\databases\\sqlite3\\temp.db");

async function runner(){
    await database.connect()
    try{
       await database.createTable(User)
       await database.createTable(Comments)
    // await database.generateNewUniqueID("users")
    // await database.createObject("users",{"username":"Sunath Thenudeejaya","password":"helldedeo123"})
    // const obj = await database.findById('users','e8b72c51-7fc4-4247-9334-6049fc9ba345')
    // const objects = await database.find('users',{'password':"helldedeo123"})
    // console.log(obj)

    // const objects = await database.updateById("users","e8b72c51-7fc4-4247-9334-6049fc9ba345",{"username":"hello world"})
    // console.log(objects)
    // const comment = new Comments()
    // const data = {comment:"this is my comment",userID:"c8448aa9-4458-45e8-a4ed-85aedc63cfc8"}
    // comment.init(data)
    // const commentValidation = await comment.validate()
    // if(commentValidation.data.okay){
    //     const response = await database.createObject("user_comments",data)
    //     console.log(response)
    // }else{
    //     console.log(commentValidation)
    // }
   
    const comments = await database.find("user_comments")
    console.log(comments)
    // console.log(response)
    await database.deleteByID("users","e8b72c51-7fc4-4247-9334-6049fc9ba345")
    }catch(error){
       console.log(error)
    }
    

    await database.close()
 
}


runner().then(e => console.log(e)).catch(e => console.log(e))
// database.closeDatabase()