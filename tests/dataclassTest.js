const {DataClass,DataClassFacotry} = require("../dataclasses/base")
const {is_required, minLength} = require("../dataclasses/validators")


class UserDataClass extends DataClass {
    username = {
        type:String,
        validations:[is_required("Username is required"),minLength(8,"Username must contains 10 letters")],
        unique:true
    };
    password = {
        type:String,
        validations:[],
        unique:true
    }

    age = {
        type:Number,
        validations:[is_required("Age is required sweetheart")]
    }


    getName(){
        return "users"
    }

}

const UserDataClassFactory = DataClassFacotry.createFactory(UserDataClass)

console.log(UserDataClassFactory.getModel())
let userData = UserDataClassFactory.createObject({'username':"Sunath",'password':"It's a secret",age:"56"})

const returnData = userData.validate()
returnData.then(e => {
    console.log(e)
    console.log(userData.model)
})

module.exports = {UserDataClassFactory,UserDataClass}