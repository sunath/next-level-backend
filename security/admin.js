
const {DataClass,DataClassFacotry} = require("../dataclasses/base")

class AdminDataClass extends DataClass {

    getName(){
        return "admins"
    }

    username = {
        type:String,
        
    }

}