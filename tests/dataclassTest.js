const {DataClass,DataClassFacotry} = require("../dataclasses/base")


class UserDataClass extends DataClass {
    username = {
        type:String,
        validations:[
            () => {new Promise()}
        ]
    };
    password = {
        type:String,
        validations:[]
    };


}

const UserDataClassFactory = DataClassFacotry.createFactory(UserDataClass)

let userData = UserDataClassFactory.createObject({'username':"Sunath",'password':"It's a secret"})
console.log(userData)
console.log(userData.validations)