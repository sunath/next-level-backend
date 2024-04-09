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

You can give different data and see what will happen.So that's the most basic of usage of data class.


## Make Fields Unique  / Save Data 

In this section we are gonna save data into mongodb by using data classes and using few other methods.
We are gonna use the same `GoogleUser` data class.But we are gonna make some changes to it.
At the moment we only gonna change the `email` field only.

```javascript
email = createMongoDBField(String,true,[validators.is_required("Email is required")])
```

Now we have pass the second argument as true.This makes the email unique.
But in order to use this unique feature we have enable mongodb connection.

If you don't know how to connect `mongoose` not `mongodb` please read their [documentation](https://mongoosejs.com/docs/index.html "mongoose documentation") 

It's so easy.We are gonna import the mongoose and pass the database connection url.
```javascript
const mongoose = require("mongoose")
```



Then at the runner function before everything we are gonna connect to mongoose.So your code should look something like this.
To learn about mongoose connection please refer to their [documentation](https://mongoosejs.com/docs/connections.html "mongoose connection")
```javascript
const mongoose = require("mongoose")
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
    await mongoose.connect("some url")
    const response = await user.validate()
    console.log(response)
}
runnner()
```

Before you run let's make changes again.There's a really important class that we are gonna need when we work with `DataClass`.And that is `DataClassFactory`.Well It's a simple class that takes a `DataClass` and let us save,get,update,delete data easily;

so in the runner function we are gonna change some lines.

```javascript
const {DataClass} = require("fast-express-backend")
const {DataClassFacotry} = require("fast-express-backend")
const mongoose = require("mongoose")
const {createMongoDBField} = require('fast-express-backend/utils')
const {validators} = require('fast-express-backend/dataclasses/')


class GoogleUser extends DataClass {
    email = createMongoDBField(String,true,[validators.is_required("Email is required")])

    firstName = createMongoDBField(String,false,[validators.is_required("First name is required"),validators.minLength(3,"First name at least must have 3 characters")])

    lastName = createMongoDBField(String,false,[validators.is_required("First name is required"),validators.minLength(3,"Last name at least must have 3 characters")])


    password = createMongoDBField(String,false,[validators.is_required("password is required"),validators.minLength(8,"password must have 8 or more characters")])

    getName(){
        return "google_users"
    }
}



const user = new GoogleUser()
user.init({email:"jhonDoe@gmail.com",firstName:"jhon",lastName:"doe",password:"This is a password too."})

async function runnner(){
    await mongoose.connect("mongodb://localhost:27017/tests")
    const GoogleUserClassFactory = DataClassFacotry.createFactory(GoogleUser)
    
    const data = {
        email:"jhonDoe@gmail.com",
        password:"My password is too strong to be broken",
        firstName:"jhon",
        lastName:"doe"
    }

    const googleUserDataClassObject = GoogleUserClassFactory.createObject(data)
    const response = await googleUserDataClassObject.validate()

    if(response.data.okay){
        await GoogleUserClassFactory.createModelObject(data)
    }else{
        console.log(response.data.error)
    }


}
runnner().then(e => {
    process.exit(0)
})
```

As it's in the above we have make changes in the runner function.

```javascript
async function runnner(){
    await mongoose.connect("mongodb://localhost:27017/tests")
    const GoogleUserClassFactory = DataClassFacotry.createFactory(GoogleUser)
    
    const data = {
        email:"jhonDoe@gmail.com",
        password:"My password is too strong to be broken",
        firstName:"jhon",
        lastName:"doe"
    }

    const googleUserDataClassObject = GoogleUserClassFactory.createObject(data)
    const response = await googleUserDataClassObject.validate()

    if(response.data.okay){
        await GoogleUserClassFactory.createModelObject(data)
    }else{
        console.log(response.data.error)
    }

}
```
1. We wait till the mongoose dataconnection is established.
2. Then we create a data class fatory - a class which has generic methods such as save data, get data, delete data from the database 
But it only have the power to delete the data of the class given.That means `GoogleUserClassFactory` only can save ,get the `GoogleUser`
data.If you remeber we override the data class getName function.The name we used will be model name.
3. Create a new `GoogleUser` object from data. It will automatically call the constructor and also the init function.
4. Validate the new object `googleUserDataClassObject`
5. if the response is good , which means no errors, we save data using DataClassFactory method called `createModelObject`
6. That's it now you can change data or send the same data twice to see wether email uniquness works.

These objects are saved in the mongodb.you call look up them.Soon we will teach you how to get in code too.for now use third party app to view the mongodb databases.

As you can see when it runs first time it runs without any output.This means it creates no error.But as soon as you run it twice without changing data you get a error a called something like `email is not unique` or `email is already used`

![Email uniqueness test](https://i.ibb.co/4VDb2c8/dataclass-test-1-2-1.png "email uniquness test")


That's it.You don't have check manually weather it's unique or not.Data class will tell you.You just
1. Create the facotry
2. Create a new object using factory
3. validate the new object
4. if the data is okay save them using dataclass factory `createModelObject` method.

You can add many unique fields.There's no problem.If one of them is already used we will give you the error in a very friendly manner.
