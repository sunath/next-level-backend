const sqlite = require("../../../databases/sqlite3")
const dataclass = require("../../../dataclasses")
const utils = require("../../../utils")

class User extends dataclass.DataClass{
    getName(){return "users"}
    username = utils.createMongoDBField(String,true,[dataclass.validators.is_required("Username is required")])
}

sqlite.createDatabase( process.cwd() +  "/tests/databases/sqlite3/temp.db").then(e => console.log(e)).catch(e => console.log(e))
const database  = new sqlite.SQLiteDatabase(process.cwd() + "/tests/databases/sqlite3/temp.db");
database.connect()
database.createTable(User)