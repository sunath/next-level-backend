const mongodb = require("../../databases/mongodb")
const { validators, DataClass } = require("../../dataclasses/")

class User extends DataClass{

    getName(){return "test_users_mongodb_connection"}
    name = mongodb.createField(mongodb.types.TEXT,true,[validators.is_required("name is required")])
    age = mongodb.createField(mongodb.types.NUMBER,false,[validators.is_required("age is required")])
}


const databaseConnection = new mongodb.MongoDBDatabase()

async function runner(){
    await databaseConnection.connect("mongodb://localhost:27017")
    // await databaseConnection.createObject(User,{'name':"Sunath",age:10})
//    const data =  await databaseConnection.findById(User,"6628967f89c71cebfaa428fb")
    // const data = await databaseConnection.updateById(User,"6628967f89c71cebfaa428fb",{age:230})
    // const data = await databaseConnection.deleteByID(User,"6628967f89c71cebfaa428fb")
    console.log(data)
}

runner().then(e => console.log(e)).catch(e => console.log((e))).finally(e => process.exit(0))