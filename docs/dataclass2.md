# Dataclass Powers


## More attributes as you gonna need.

First of all let's start where we stopped.If you didn't read the data class overview.Please go ahead and read it.We gonna start where we left.

```javascript
const {DataClass} = require("fast-express-backend")
const {createMongoDBField} = require('fast-express-backend/utils')
const {validators} = require('fast-express-backend/dataclasses/')

class GoogleUser extends DataClass {
    email = createMongoDBField(String,false,[validators.is_required("Email is required")])

    getName(){
        return "google_users"
    }
}
```


Just like we mentioned earlier we gonna add more fields our existing `GoogleUser`
So let's add firstName,lastName,password fields


```javascript

const {DataClass} = require("fast-express-backend")
const {createMongoDBField} = require('fast-express-backend/utils')
const {validators} = require('fast-express-backend/dataclasses/')

class GoogleUser extends DataClass {
    email = createMongoDBField(String,false,[validators.is_required("Email is required")])

    firstName = createMongoDBField(String,false,[validators.is_required("First name is required"),validators.minLength(3,"First name at least must have 3 characters")])

    lastName = createMongoDBField(String,false,[validators.is_required("First name is required"),validators.minLength(3,"Last name at least must have 3 characters")])


    password = createMongoDBField(String,false,[validators.is_required("password is required"),validators.minLength(8,"password must have 8 or more characters")])

    getName(){
        return "google_users"
    }
}



```

`createMongoDBField` takes a few arguments.

1. Type - `String`,`Number`,`Date`
2. Unique - A Boolean (Weather the field must be unique or not).For now we ain't gonna use this because we don't have database connection for now.We will in few minutes.

3. validatiors - a list of functions

These functions must take a argument and filter the given value and output a reponse.
Based on that response we decide weather the field is valid or not.
If not valid it will be catched in the validate method.

There are more.But we leave them for validator documentation.

So now we have a full class.So let's see what it can do.



`validators.minLength` is a another validator function just like the `validators.is_required`.It takes these arguments

1. Length - how many characaters at least it should have
2. errorMSG - message you want to send to the user if the value length is less than it should be


So let's run it just like before.We don't change the data for now to see what will happen


```javascript

const {DataClass} = require("fast-express-backend")
const {createMongoDBField} = require('fast-express-backend/utils')
const {validators} = require('fast-express-backend/dataclasses/')

class GoogleUser extends DataClass {
    email = createMongoDBField(String,false,[validators.is_required("Email is required")])

    firstName = createMongoDBField(String,false,[validators.is_required("First name is required"),validators.minLength(3,"First name at least must have 3 characters")])

    lastName = createMongoDBField(String,false,[validators.is_required("First name is required"),validators.minLength(3,"Last name at least must have 3 characters")])


    password = createMongoDBField(String,false,[validators.is_required("password is required"),validators.minLength(8,"password must have 8 or more characters")])

    getName(){
        return "google_users"
    }
}



const user = new GoogleUser()
user.init({email:"jhonDoe@gmail.com"})

async function runnner(){
    const response = await user.validate()
    console.log(response)
}
runnner()

```


Run the file.You should get a response like this.
```
{
  data: { okay: false, error: 'firstName must be a String' },
  field: 'firstName'
}
```


![new google data class](https://i.ibb.co/VmBBgm6/dataclass-test-1-1-1.png "data class with invalid data")



Now let's change the data and re run the file.change the `user.init` line to something like this.

```javascript
user.init({email:"jhonDoe@gmail.com",firstName:"jhon",lastName:"doe",password:"This is a password too."})
```

Re run the file you should not get any error.

![dataclass when the full data given](https://i.ibb.co/Wk27N35/dataclass-test-1-1-2.png "an example with full data")