# Utility Functions 
These functions are the one of the most important functions `fast-express-backend` provides.There are many shortcuts you can get from these to make your life easier while you coding .But not in your real life.I mean I can't tell you a way or shortcut to `how to get a partner` 😜😜.So let's dive in to utility functions right now.

## createMongoDBField 
This function is one of the most import function you are gonna need.It's a helper function automate thing more faster.

Imagine if you define the properties of a data class by hand it may take a bit of time.

```javascript

class User extends DataClass{

    getName(){return "users"}

    username = {
        type:String,
        unique:true,
        validators:[validators.is_required("Username is required")]
    },

    password = {
        type:String,
        unique:true,
        validators:[validators.is_required("password is required"),validators.minLength(8,'password need at least 8 characters')]
    }
}
```

If you don't know what are validators are don't worry,they are basically functions that validate the input data.Let's get to the point here.

As you can see we have to write a bit of line to define the username field properties.
```javascript
username = {
        type:String,
        unique:true,
        validators:[validators.is_required("Username is required")]
}
```

But what if you can short it.That's why we use `createMongoDBField`.For example we can write the above code in just one line.

```javascript
const {createMongoDBField} = require("fast-express-backend/utils")
username = createMongoDBField(String,true,[validators.is_required("Username is required")])
```

That's it how easy it is compared to the longer version.Now let's talk about it's arguments.
`createMongoDBField` takes a few arguments respectively
1. Type - Type of the Field (it can be `String`,`Number`,`Boolean`,`Date`)
2. Uniqueness - Whether the field should be unique or not (Enable MongodbUnique Validator)
3. validators - a list contains the validators
4. before validation - a function  changes the data before the validation ( more like a map function)
5. after validation - a function changes data after data validation (like before saving data)



## Function to Promise
A shortcut to write validators.In `fast-express-backend` every validator must return a promise.
It takes a function as a argument.But this function must takes three arguments.There are
1. resolve - resolve object we get when we create a new promise
2. reject - reject object in the promise 
3. value - value given by the user

`functionToPromise` create a another function and it takes a value as an argument.In that function we create a promise object and return it.But inside the promise object we give the control over to use.
Your function gonna run there with the value given to highest function.

```javascript
const {functionToPromise} = require("fast-express-backend/utils")

function rangeValidator(resolve,reject,value){
    if(value >=0 && value <= 100){
        resolve({okay:true})
    }else{
        resolve({okay:false,error:"Must be in the range"})
    }
}

const validatorFunction = functionToPromise(rangeValidator)

validatorFunction(-23).then(e => console.log(e))
```

## Quick check of the required field
let's say you don't want run many validators.But you only want to check whether field is in object or not.That's what `quickCheckOfRequiredFields` function does.It takes an object also and a array of string.That list is the fields you want to check in the object.

```javascript
const {quickCheckOfRequiredFields} = require("fast-express-backend/utils")

const userSentObject = {
    username:"helo",
    password:"dede",
    age:""
}

const response = quickCheckOfRequiredFields(userSentObject,['username','password','age','birthday'])
console.log(response)
```

if response is none all the fields are defined.But the value might be null.Otherwise it returns the field that wasn't defined.

## Password Hashing 
Password hashing is of course a part of security.we don't know why 😒😒😒😒 we just thought it will be more likely a util function for you.So we put it in our utils.
This password hashing is power up by the argon library.For now we provides two functions in the password hashing.Actually there are three but for now let's say there's only two 😁😁😁😁😁😁

1. Encrypting the password
We just give the password and it will be encrypted by the library.Of course it's `argon`.But we just thought it might be easier for you to import many of them from a single library.
One thing to keep in mind that is hashPassword run `async`. 

```javascript
const {hashPassword,verifyHashedPassword} = require("fast-express-backend/utils")

const password = "fm3kfj3bbr3.r3"
hashPassword(password).then(e => {
    console.log("password: ", e)
})
```

That's it .Just like that you can hash the password.Once again magic doe by the `argon` library.So let's see how to use the `verifyPassword` function.Well it takes two arguments.
1. hashed password - Password hashed by the argon library
2. plain password - plain password given by the user
This will tell whether the given password and the hashed password are a match or not.

```javascript
const {hashPassword,verifyHashedPassword} = require("fast-express-backend/utils")

const password = "fm3kfj3bbr3.r3"
hashPassword(password).then(e => {
    verifyHashedPassword(e,password).then(o => console.log(`${e} and ${password} are a match : ${o}`))
    verifyHashedPassword(e,"Wjr3hjr3r#").then(o => console.log(`${e} and Wjr3hjr3r# are a match: ${o}`) )
})

```

These are the most important predefined utility functions at the moment.Soon it will be updated.
![one eternity later](image-1.png)

It might be the same.So don't get hyped.I already know you don't 😜😜😜

So for now that's it for utils