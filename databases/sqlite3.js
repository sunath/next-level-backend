
// const { rejects } = require("assert");
const fs = require("fs")
const {Database} = require("./database")
const {DataClass, DataClassFactory} = require("../dataclasses")
/**
 * Create a new database in the given url
 * @param {url} - url 
 */
function createDatabase(url){
    return new Promise((resolve,rejects) => {
        fs.writeFile(url,"",function(e){
            if(e){
                rejects("Could not create the database")
            }else{
                resolve("Database created successfully")
            }
        })
    
    })   
}


/**
 * converts a dataclass field into a table column text in sqlite3 
 * @param {Object} fieldObj 
 */
function convertFieldToColumn(name,fieldObj){
    return `${name} ${fieldObj.type} ${fieldObj.unique ? "UNIQUE" : ""}`
}


// types that database can handle
const types = {
    INTEGER:"INTEGER",
    TEXT:"TEXT",
    BOOLEAN:"BOOLEAN",
    DATE:"TEXT",
    REAL:"REAL",
    FLOAT:"NUMERIC"
}

const sqlite = require("sqlite3").verbose()

class SQLiteDatabase extends Database{

    database;
    queries = []

    constructor(URL){
        super()
        this.URL = URL
    }

    connect(){
       this.database = new  sqlite.Database(this.URL,sqlite.OPEN_READWRITE,function(error){
            if(error){
                console.log(error)
            }else{
                console.log("connected to the database ")
            }
        })
    }

    /**
     * Creates a table in the database to the class given
     * if the table is already created no errors will occur
     * @param {DataClass} dataClass 
     */
    createTable(dataClass){
        const dataClassInstance = new dataClass();
        const allFields = DataClassFactory.createFactory(dataClass).getModelFields();
        let userDefinedFields = allFields.splice(0,allFields.length-2)
        let tableTemplate = `CREATE TABLE "${dataClassInstance.getName()}" (${fields.map((e,i) => convertFieldToColumn(e))}) `
        console.log(tableTemplate)
    }

}

module.exports = {createDatabase,SQLiteDatabase,types}