# Getting to know before validations and after validations

Data class fields have another two special attributes.There are `beforeValidation` and `afterValidation`.
To understand this let's first create a data class.

```javascript

const {DataClass,DataClassFactory} = require("fast-express-backend")
const { validators} = require("fast-express-backend/dataclasses") 
const  {createMongoDBField}  = require("fast-express-backend/utils")

function beforeUserData(value){
    return null
}

class User extends DataClass{

    getName() { return "users"}

    username = createMongoDBField(String,false,[validators.is_required("username is required")],beforeUserData)

}

const UserFactory = DataClassFactory.createFactory(User)
const user = UserFactory.createObject({'username':"lol44lol"})

user.validate().then(e => console.log(e))
```

if you run this you should get the response something like this.

```javascript
{
  data: { okay: false, error: 'username must be a String' },
  field: 'username'
}
```

But we have given the username in the data.But if you look at the `beforeUserData` function.Well it returns null no matter what value is given.Third argument in `createMongoDBField` is a function that takes a value and returns a value.more like a map function.Then value returned by the function will be tested.That's why we get the  error.For example let's change the `beforeUserData` function return value see the response.


```javascript

const {DataClass,DataClassFactory} = require("fast-express-backend")
const { validators} = require("fast-express-backend/dataclasses") 
const  {createMongoDBField}  = require("fast-express-backend/utils")

function beforeUserData(value){
    return "not a user"
}

class User extends DataClass{

    getName() { return "users"}

    username = createMongoDBField(String,false,[validators.is_required("username is required")],beforeUserData)

}

const UserFactory = DataClassFactory.createFactory(User)
const user = UserFactory.createObject({'username':"lol44lol"})

user.validate().then(e => console.log(e))
```
Now you should get a innocent response saying data is okay.
```javascript
{ data: { okay: true } }
```
So before validation runs before the validation happens in order to change the value into new format or something like that.


And just like that `afterValidation` is a function runs after the validation happens.But remember the above one isn't async.But afterValidation function must be async.For that to to happen let's make some difference in the above code.

```javascript
const {DataClass,DataClassFactory} = require("fast-express-backend")
const { validators} = require("fast-express-backend/dataclasses") 
const  {createMongoDBField}  = require("fast-express-backend/utils")

function beforeUserData(value){
    return "not a user"
}

async function hashPassword(password){
    return password + " ke3rrneb f egjffhf4"
}

class User extends DataClass{

    getName() { return "users"}

    username = createMongoDBField(String,false,[validators.is_required("username is required")],beforeUserData)

    password = createMongoDBField(String,false,[validators.is_required("password is required")],null,hashPassword)

}

const UserFactory = DataClassFactory.createFactory(User)
const user = UserFactory.createObject({'username':"lol44lol","password":"ekekk3jhjr3"})

user.validate().then(e => {
    user.transformValidateDataToBeSaved({'username':"lol44lol","password":"ekekk3jhjr3"}).then(f => {
        const savableObject = Object.assign({},{'username':"lol44lol","password":"ekekk3jhjr3"},f)
        console.log(savableObject)
    }).then(e => {process.exit(-1)})
})
```

well we have set empty the third argument in the password(beforeValidation) and we have set up afterValidation function in the password.Well if you wanna see how it works,well we first run the user validation -> run the transformValidatedDataToBeSaved function -> get the output of it and combine the validated data and the `transformValidatedDataToBeSaved` function output.

transformValidatedToBeSaved takes the input data and returns only an object that it changes .So we create a new empty object and set it to the user input data,then overrides the fields given by the `transformValidatedDataToBeSaved` function.

Don't worry you don't have to do these by hand.That's why we have the DataClassFactory.