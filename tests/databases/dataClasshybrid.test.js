
const {DataClass} = require("../../dataclasses")
const mySql = require("../../databases/mysql")
const postgres = require("../../databases/postgresql")
const {DATABASE_TYPES, Databases} = require("../../databases")
const { createMongoDBField } = require("../../utils")
const mongodb = require("../../databases/mongodb")

class User  extends DataClass{
    DATABASE_REPRESENTATION = DATABASE_TYPES.MYSQL
    getName(){return "test_hybrid_users"}
    password = mySql.createField(mySql.types.VARCHAR,true,true,[],null,null,{max:200})
    username = mySql.createField(mySql.types.VARCHAR,true,true,[],null,null,{max:200})
}

class PostgresUser extends DataClass {
    DATABASE_REPRESENTATION = DATABASE_TYPES.POSTGRES
    getName(){return "test_hybrid_users"}
    username = postgres.createField(postgres.types.TEXT,true,true)
    password = postgres.createField(postgres.types.TEXT,true,true)
}

class MongoDBUser extends DataClass {
    DATABASE_REPRESENTATION = DATABASE_TYPES.MONGODB
    getName(){return "test_hybrid_users_mongodb"}

    username = createMongoDBField(String,true)
    password = createMongoDBField(String,true)
}


async function runner(){
    console.log("We are running")
    const database = new mongodb.MongoDBDatabase()
    await database.connect("mongodb://localhost:27017")
    Databases.connections[DATABASE_TYPES.MONGODB] = database
    console.log("Connected to the database")

    const data = {"username":"Sunath Thenujay dsdsa","password":"This is mongodbdss guys"}

    const user = new MongoDBUser()
    user.connection = database
    user.classSelf = MongoDBUser
    user.init(data)
    const response = await user.validate(data)
    if(response.data.okay){
        const object  = await database.createObject(MongoDBUser,data)
        console.log(object)
    }else{
        console.log(response)
    }

}


runner().then(e=> console.log(e)).catch(e => console.error(e)).finally(e => process.exit(0))