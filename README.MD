# Next Level Backend

## Quick Start Guide

### Preparing The Envrionment

```bash
mkdir HelloWorld
cd ./HelloWorld
npm install next-leve-backend
```

Next open the the HelloWolrd folder using Visual Studio Code or the code editor you use.

### Get up and Running

1. Create a file called  ` main.js `

	Since next level backend is integrated using express js. We will use the same base as the express.
	
    ```javascript
    // import express and it's base components
    // we will use the express to create the server
    // express router will be used to handle views(get,post,put,delete)
    const express = require("express")
    const {Router} = require("express")

    // import mongodb and connect it
    const mongoose  = require("mongoose")
    // the url depends on the mongodb instance you are gonna use
    // at the time of writing we are running it locally,
    // but you can connect it to the remote server
    // please read mongoose documentation if you want to know more  
     mongoose.connect("mongodb://localhost:27017")
	 ```

     Let's stop the `main.js` fie there.Since this libary contains helper functions and classes to extends the experience of express let's use our first helper function.

2. Create a file called `models.js`

    `Notice : This file and main.js should in the same directory.It's not a must.But if you want to follow along please do it for now.you can write it in your own way after this`

    So create the `models.js` file . 

    ```javascript

    // import the data class
    const {DataClass} = require("fast-express-backend")
    // a shortcut method
    const {createMongoDBField} = require('fast-express-backend/utils')
    // import some functions validate your data
    const {validators} = require('fast-express-backend/dataclasses/')


    // Create a class called MovieDataClass
    // Make sure it's extends from fast express backend data class
    // this is also the movie Schema and the model you see in mongoose
    class MovieDataClass extends DataClass {

        // you must override the getName functions
        // you must return a unique name for each data class you create
        getName(){
            return "movies"
        }
        
        // now we can describe what our model looks like

        // first it has a name
        // so we just give the class an attribute called name
        // then assign the value of createMongoDBField()
        // first argument is the type - String,Number,Boolean,Date
        // then weather the field is unique or not
        // then pass the validators
        // it will check weather the data is correct or not
        // for now don't worry just copy and pase this.
        // when we run the code you will understand everything
        name = createMongoDBField(String,true,[validators.is_required("Name is required")])

        // just like that we create a another attribute called date
        date = createMongoDBField(Date,false,[validators.is_required("Date is required")])
    }

    module.exports = {MovieDataClass}

    ```


    Okay that's it. Now you have created a model / schema / dataValidation class from one class.Don't worry for now.
    We will tell everything.As a startup code this without thinking.


3. Now go back to the `main.js` file  

    then add these following lines.

    ```javascript


    // import fast express backend components
    const {applyBasicCrud} = require("fast-express-backend")


    // import the models
    const {MovieDataClass} = require("./models")

    // create routers
    const movieRouter = Router()
    applyBasicCrud(movieRouter,MovieDataClass)

    // create the base server
    const app = express()
    // make sure it can use json to send and get data
    app.use(express.json())
    // set the routers in the app
    app.use("/movies",movieRouter)

    // run the app
    app.listen(8000,() => {
        console.log("app is running on port 8000")
    })
    
    ```

4. Your `main.js` file should look like this 

    ```javascript


    // import express and it's base components
    const express = require("express")
    const {Router} = require("express")

    // import mongodb and connect it
    const mongoose  = require("mongoose")
    mongoose.connect("mongodb://localhost:27017")

    // import fast express backend components
    const {applyBasicCrud} = require("fast-express-backend")


    // import the models
    const {MovieDataClass} = require("./models")

    // create routers
    const movieRouter = Router()
    applyBasicCrud(movieRouter,MovieDataClass)

    // create the base server
    const app = express()
    // make sure it can use json to send and get data
    app.use(express.json())
    // set the routers in the app
    app.use("/movies",movieRouter)

    // run the app
    app.listen(8000,() => {
    console.log("app is running on port 8000")
    })

    
    ```

5. Last thing is to run this app

    go to your in visual studio code terminal

    ```bash
    node main.js
    ```
6. That's it . Now you have successfully created an app that can get,save,update,and delete movies.Let's test it with postman or whatever rest api tester app you like

    when we send requests we will use the date `Date()` output just for now.
    So open the postman create a new post request.First let's test it with no data
    ![screenshot]()