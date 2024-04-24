const { default: mongoose } = require("mongoose");
const { Database } = require("./database");

const {getModelObjectWithId, getModelObjectWithPayload,updateTheModelWithTheId, deleteObjectFromCollection} = require("../actions");
const { DataClassFactory } = require("../dataclasses");

const savedClasses = {}
function dataClassToModel(dataClass){
    const name = new dataClass()
    if(!savedClasses[name]){
        const model = new DataClassFactory.createFactory(dataClass).getModel()
        savedClasses[name] = model
        return model
    }
    return savedClasses[name]
}

class MongoDBDatabase extends Database {

    async connect(url){
        await mongoose.connect(url)
    }

    async findById(dClass,id){
        return getModelObjectWithId(dataClassToModel(dClass),id)
    }

    async find(dClass,query){
        return getModelObjectWithPayload(dataClassToModel(dClass),query)
    }

    async updateById(dClass,id,data){
        return updateTheModelWithTheId(id,dataClassToModel(dClass),data)
    }

    async deleteByID(dClass,id){
        return deleteObjectFromCollection(dataClassToModel(dClass),id)
    }

    


}