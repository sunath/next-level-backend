const {DataClass,DataClassFacotry} = require("../dataclasses/base")
const {is_required, minLength} = require("../dataclasses/validators")


class UserDataClass extends DataClass {
    username = {
        type:String,
        validations:[is_required("Username is required"),minLength(8,"Username must contains 10 letters")],
    };
    password = {
        type:String,
        validations:[]
    }

    age = {
        type:Number,
        validations:[is_required("Age is required sweetheart")]
    }


}

const UserDataClassFactory = DataClassFacotry.createFactory(UserDataClass)

let userData = UserDataClassFactory.createObject({'username':"Sunath",'password':"It's a secret",age:"56"})

const returnData = userData.validate()
returnData.then(e => {
    console.log(e)
})