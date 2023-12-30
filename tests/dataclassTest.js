const {DataClass,DataClassFacotry} = require("../dataclasses/base")


class UserDataClass extends DataClass {
    username = {
        type:String,
        validations:[(val) => {
            return new Promise((resolve,reject) => {
                resolve({error:true,details:'username is required'})
            })
        }]
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
console.log(userData)

const returnData = userData.validate()
returnData.then(e => {
    console.log(e)
})