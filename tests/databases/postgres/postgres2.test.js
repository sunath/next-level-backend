

const { DATABASE_TYPES, Databases } = require("../../../databases")
const postgres = require("../../../databases/postgresql")
const {DataClass} = require("../../../dataclasses")


const db = new postgres.PostgresDatabase()

class User extends DataClass{
    getName(){return "users"}

    username = postgres.createField(postgres.types.TEXT,true,true)
}

class Comment extends DataClass {
    DATABASE_REPRESENTATION = DATABASE_TYPES.POSTGRES

    getName(){return "comments"}

    commentUser = postgres.createRelationalField(postgres.types.TEXT,false,true,User,"_id")
    commentText = postgres.createField(postgres.types.TEXT,false,true)
}

async function runner(){
    await db.connect("localhost","postgres","HelloWorld1234","testDatabase")
    Databases.connections[DATABASE_TYPES.POSTGRES] = db
    // await db.createTable()
   const response =  await db.createTable(User)
   await db.createTable(Comment)
    // const user = await db.createObject(User,{"username":"helldsdsdsddsdssso world"})
    // console.log(user.rows[0])
    // const newCreatedUserId = user.rows[0]._id
    // const getTheUserAgain = await db.findById(User,newCreatedUserId)
    // const getTheUserAgain = await db.find(User,{"username":"helldsdsdsddsdssso world"})
    // console.log("This is the new user ", getTheUserAgain.rows[0])
    // const  deleteUser = await db.deleteByID(User,'b34048e1-bf6e-42cf-92ca-ec5f2c747afc')
    // console.log(deleteUser.rows)
    // const updatedUser = await db.updateById(User,"f871df37-f913-4277-b3b8-4d85a5aed78f",{"username":"Fuckdsds off"})
    // console.log(updatedUser.rows)
    // console.log(response);
    await db.disconnect()
}


runner().then(e => console.log(e)).catch(e => console.error(e))