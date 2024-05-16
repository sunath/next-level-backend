
const { Client } = require("pg")
const {Database} = require("./database")
const uuid = require('uuid')

const {dataClassToName} = require("../utils/dataclassToName")
const { DataClassFactory } = require("../dataclasses")
const { DATABASE_TYPES } = require(".")

const types = {
    "INTEGER":"BIGINT",
    "TEXT":"TEXT",
    "FLOAT":"DOUBLE PRECISION",
    "BOOLEAN":"BOOLEAN",
    "DATE":"DATE"
}


/**
 * 
 * @param {*} type 
 * @param {*} unique 
 * @param {*} notNull 
 * @param {*} validators 
 * @param {*} before_validation 
 * @param {*} after_validation 
 * @param {*} metaData 
 * @returns 
 */
function createField(type,unique,notNull=true,validators=[],before_validation=null,after_validation=null,metaData={}){
    let data = {type:null}
    if(type == types.TEXT){
        data.type = String
    }else if(type == types.DATE){
        data.type = Date
    }else if(type == types.BOOLEAN){
        data.type = Boolean
    }else if(type == types.FLOAT || type == types.INTEGER){
        data.type == Number
    }

    return {...data,sqlType:type,unique,notNull,validators,before_validation,after_validation,metaData}
}

function createRelationalField(type,unique,notNull,relationalClass,relationalField,metaData={}){
    const basicObject = createField(type,unique,notNull)
    return {...basicObject,relationalClass,relationalField,metaData,relational:true}
}

function fieldToQueryString(name,field){
    return `${name} ${field.sqlType} ${field.notNull ? "NOT NULL" : ""}`
}

function relationFieldToString(name,field){

    const dataClass = field.relationalClass
    const tableName = (new dataClass).getName()

    if(name == "_id"){
        return `CONSTRAINT fk_${tableName} FOREIGN KEY (${name}) REFERENCES ${tableName} (${field.relationalField}) `  
    }
    return `CONSTRAINT fk_${tableName} FOREIGN KEY (${name}) REFERENCES ${tableName} (${field.relationalField}) `
}

class PostgresDatabase  extends Database{


    constructor(){
        super()
        this.dataClassToName = dataClassToName.bind({})
    }

    async connect(host,user,password,database,port=5432,metaData){
        const client = new Client({host,port,user,password,database,port,...metaData})
        try{
            await client.connect()
            this.connection = client
        }catch(error){
            console.error(error)
            throw new Error("could not connect the database.")    
        }
        
        
    }

    async createTable(dataClass){
        const name = this.dataClassToName(dataClass)
        const instance = new dataClass()
        
        const keys = DataClassFactory.createFactory(dataClass,{'DATABASE':DATABASE_TYPES.POSTGRES}).getModelFieldsExpect(['_id','createdAt','updatedAt'])
        const uniqueFields = keys.filter(e => instance[e].unique)
        const foreignKeys = keys.filter(e => instance[e]['relational'])
        let tableTemplate = `CREATE TABLE IF NOT EXISTS ${name} (_id TEXT NOT NULL ,createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,${keys.map(e => fieldToQueryString(e,instance[e])).join(",") }, ${uniqueFields.length > 0 ? `UNIQUE(${uniqueFields.join(",")}),`  : ""} PRIMARY KEY (_id) ${foreignKeys.length > 0 ?"," : ''} ${foreignKeys.map(e => relationFieldToString(e,instance[e] || null)).join(",")});`
        tableTemplate += `
CREATE OR REPLACE FUNCTION update_changetimestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';



DROP TRIGGER IF EXISTS ${name}_update_updated_at ON ${name};
CREATE TRIGGER ${name}_update_updated_at
    BEFORE UPDATE ON ${name}
    FOR EACH ROW
    EXECUTE PROCEDURE update_changetimestamp_column(updateAt)        
`
    return await this.connection.query(tableTemplate)
    }


    async createObject(dataClass,data){
        const name = this.dataClassToName(dataClass)
        const keys = ["_id",...DataClassFactory.createFactory(dataClass,{'DATABASE':DATABASE_TYPES.POSTGRES}).getModelFieldsExpect(['createdAt','updatedAt'])]
        console.log(keys)
        const query  = `INSERT INTO ${name} (${keys.join(",")}) VALUES (${keys.map((e,i) => `$${i+1}`).join(",")}) RETURNING *`
        const id = await uuid.v4()
        data['_id'] = id
        // console.log(query,...keys.map(e => data[e])])
        console.log(data,[keys.map(e => data[e])])
        return await this.connection.query(query,keys.map(e => data[e]))
    }


    async disconnect(){
        await this.connection.end();
    }


    async findById(table,id){
        const name = this.dataClassToName(table)
        const query = `SELECT * FROM ${name} WHERE _id=$1`
        return await this.connection.query(query,[id])
    }

    async find(table,query){
        const name = this.dataClassToName(table)
        const queryString = `SELECT  * FROM ${name} WHERE ${Object.keys(query).map((e,i) => `${e}=$${i+1}`).join(",")}`
        const result =  (await this.connection.query(queryString,Object.keys(query).map(e => query[e]))).rows
        return result.length == 0 ? null : result[0]
    }

    async deleteByID(dataClass,id){
        const name = this.dataClassToName(dataClass)
        const queryString = `DELETE FROM ${name} WHERE _id=$1`
        return await this.connection.query(queryString,[id])
    }

    async updateById(dataClass,id,changes){
        const name = this.dataClassToName(dataClass)
        const queryString = `UPDATE ${name} SET ${Object.keys(changes).map((e,i) => `${e}=$${i+1}`).join(",")} WHERE _id=$${Object.keys(changes).length+1}`
        return await this.connection.query(queryString,[...Object.keys(changes).map(e => changes[e]),id])
    }

}

module.exports = {PostgresDatabase,createField,types,createRelationalField}