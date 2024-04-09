# DataClass

A simple class that handle request data.

## Overview
A data class is a class which has properties which defines it's architecture;
For example let's think of a `Google User`.Well first of all user has a email.Moreover user has his first name and last name.Apart from that user has a password.There are more but for now let's stop there.
So using `DataClass` how we define the someone like a google user;

So let's break it n parts

1. Define the dataclass.

    Create a class called GoogleUser and extends it using DataClass in the `fast-express-backend`.
    ```javascript
    const {DataClass} = require("fast-express-backend")
    class GoogleUser extends DataClass {}
    ``` 

    Using object oriented programming now our `GoogleUser` class is a data class;

2. Setting up attributes

    Next step is to give the class fields that we need.In this case user need a email address.
    So let's add it our data class.

    But let's import a another helper function.

    ```javascript
    const {createMongoDBField} = require('fast-express-backend/utils')
    ```

    This function help us to define properties.We can do it manually too.But it's faster and more practial.

    So let's add the email field;

    ```javascript
    const {DataClass} = require("fast-express-backend")
    const {createMongoDBField} = require('fast-express-backend/utils')
    class GoogleUser extends DataClass {
       email = createMongoDBField(String)
    }
    ```

    We have define the email;by the way we can pass more arguments to the `createMongoDBField` but for now we are focused on the dataclass.

3. Adding validators to the dataclass

    Imagine if we give the freedom send any data to the user, well you now what we will happen.
    They somethimes don't send the data that must be sent or send wrong data.

    So let's add validators to our email.

    first we need to import `validators` functions.There are a few you gonna need most of the time.

    ```javascript
    const {validators} = require('fast-express-backend/dataclasses/')
    ```

    These are predefined validators.You can make your own ones.At the moment we are focused on creating dataclass so we ain't gonna tell you a lot about validators.Basically they will validate user data;


    now let's make the email sure the user that , he must send the email,and it has more than 4 charaters.

    In the `GoogleDataClass` change the email line to

    ```javascript
    email = createMongoDBField(String,false,[validators.is_required("Email is required")])
    ```

    So our whole code looks like this now.

    ```javascript
    const {DataClass} = require("fast-express-backend")
    const {createMongoDBField} = require('fast-express-backend/utils')
    const {validators} = require('fast-express-backend/dataclasses/')

    class GoogleUser extends DataClass {
        email = createMongoDBField(String,false,[validators.is_required("Email is required")])
    }

    ```

5. Naming our `GoogleDataClass`.

    every data class must have a unique name.It's a must.So let's make the `GoogleUser` to have a unique name.
    It's very easy , you just need to override a method called `getName()`. This function must return a string.

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


    That's it now we have the `GoogleUser` data class.
    We will add first name , last name and more.
    But first let's get the idea by testing the dataclass;


6. Let's test it

    create a new object from the `GoogleUser`.Don't pass any arguments to it's constructor.
    let's first see what happen we validate the class givin any data.

    Every data class object has a method called init.That's where we give it data.
    You don't have to do these in manually when we introduce you the data class factory.
    But for now let's do things manually for more understanding.

    then we have defined a function called `runner`.It's job is to run the data class validation function async.
    Since we can't direcly await in node js we use a helper function run in directly in node js.
    Then in the runner we wait till the validate ends.
    Every `DataClass` has a method called `validate` , and it's where the validation happen.
    It will grab the most of the errors.
    Response will say wether the data was good or bad
    ```javascript

    const user = new GoogleUser()
    user.init({})

    async function runnner(){
        const response = await user.validate()
        console.log(response)
    }
    runnner()

    ```

    You should get a response like this.

    ```
    {
        data: { okay: false, error: 'email must be a String' },
        field: 'email'
    }
    ```

    ![Test one response](https://i.ibb.co/XSnyf1X/dataclass-test-1-1.png "user")


    response object always returns a object.At the same time it always has a attribute called data.
    If `response.data.okay` is true that means data has no error,but if it's false that means you have error in a data field.
    you can see the error too.
    if the `response.data.okay` is false that you can get the error too.
    `response.data.error` will give you the error;


    

    Now let's give the data and see what happens.

    ```javascript

    const user = new GoogleUser()
    user.init({email:"jhonDoe@gmail.com"})

    async function runnner(){
        const response = await user.validate()
        console.log(response)
    }
    runnner()

    ```

    !["when the data is given'](https://i.ibb.co/YyrQfCg/dataclass-test-1-2.png "example with the data")


    as you can see `response.data.okay` is true.That means the data is okay.
    So that's the quick overview.Let's take it to the next level

