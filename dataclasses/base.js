const iterateList = require("../utils/iterateAndPrint")

/**
 * Base class for every data class
 * 
 * Data class will be used for validating and turn dictonary into classes
 * 
 * In case you are an oop fan
 */
class DataClass{}

/**
 * This error mainly be thrown by the DataClassFactory
 * 
 * It will be thrown if you give factory something that not extends from DataClass
 */
class InvalidDataClassError extends Error{}

class DataClassFacotry{

   static createObject(dataClass){
        let object = new dataClass()
        if(!(object instanceof DataClass))throw new InvalidDataClassError("Data class is invalid");

        iterateList(Object.getOwnPropertyNames(object),(e) => {
            console.log(object[e] == String)
        })
    }

}