# Validators

Validators are the most fundamental and important functions in the `fast-express-backend`.Well basically validators are functions that takes a value and return weather it matches a pattern or some basic condition.

The most basic basic validator the is the `is_required` validator.It takes a value then check it's state , if it is null or undefined return false, otherwise true


```javascript

function is_required(value){
    if(value != null || value != undefined){return true}
    else false; 
}

```


Or we can write the simplfied version of this function

```javascript
function is_required(value){
    return (value != null || value != undefined) ? true : false;
}
```

But we have change this function a little bit to make it more dynamic so we can integrate it with the `fast-express-backend`.There are few things we have to remember when we creating a validator on our own in `fast-express-backend`.

1. function should always return a promise ( so you can run async functions or normal functions )
2. promise output must have static shape (we will detail it later)

If we were to write this function in order to use in `fast-express-backend` we have to change the code a little bit.
If you don't know what are promises and how to use them please refer [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#chained_promises "promises mdn link")

```javascript

function is_required(value){
    return new Promise(function(resolve,reject){
     if(value != undefined || value != null)resolve({okay:true})
     resolve({okay:false})   
    })
}

```

Instead of directly returning the response you must return it in a promise.Otherwise it throw errors when we use them in `DataClass`.
If you look closely you can see that our response in the promise look similar.Remember you must return a object.That object is required to have a property called `okay`.That's where the `fast-express-backend` knows whether the value passed the test or not.You call add more properties to object and they won't affect.For example let's say you want to send error message in string.

```javascript

function is_required(value){
    return new Promise(function(resolve,reject){
     if(value != undefined || value != null)resolve({okay:true})
     resolve({okay:false,error:"This field is required"})   
    })
}

```

Just like that you can you change the response.But you must have `okay` property.
So let's take this validator to next level.We will make the function dynamic and response error looks more dynamic.

```javascript

function is_required_validator(errorMSG="This field is required"){
    
        function is_required(value){
            return new Promise(function(resolve,reject){
            if(value != undefined || value != null)resolve({okay:true})
            resolve({okay:false,error:errorMSG})   
        })
    }
      return is_required
}

```
So now you can create many validator functions that are dynamic.This is to say that you can send a specific error message to username field and a especial error to password.

```javascript

const usernameRequiredValidator = is_required_validator("UserName is required")
const passwordRequiredValidator = is_required_validator("Password is required")
const commonFieldValidator = is_required_validator()

```

If you pass a null value to usernameRequiredValidator it will output `{okay:false,error:"Username is required"}`.Just like that if you pass a null value to passwordRequiredValidator it will output `{okay:false,error:"Password is required"}`.In the `commonFieldValidator` output when the value is null should look like this `{okay:false,error:"This field is required"}`

This is the basic validator in the `fast-express-backend`.Just like that we can define many of them and use them.Now let's see a shortcut make our work a little bit shorter.First we are gonna import an utility function called `functionToPromise` function.In order to use that we need to make a few changes in our `is_required` function.

```javascript

const {functionToPromise} = require("fast-express-backend/utils")
function is_required_validator(errorMSG="This field is required"){
    
        function is_required(resolve,reject,value){
            if(value != undefined || value != null)resolve({okay:true})
            resolve({okay:false,error:errorMSG})   
        }
    
      return functionToPromise(is_required) 
}

```

`functionToPromise` function works just like a wrapper function.It takes a function as an argument.But the function should take 3 arguments.
1. resolve - This is the resolve function in the promise
2. reject - This is the reject function in the promise
3. value - the value you gonna pass


You can write it yourself too.It's too easy.We wills show you how to write it yourself for better understanding.But it's a good idea to use the `functionToPromise` function given by the `fast-express-backend` 😁😁😁😁.

```javascript

function functionToPromise(func){
    return function(value){
        return new Promise((resolve,reject){
            func(resolve,reject,value)
        })
    }
}

```

When we execute the functionPromise we return a another inner function.We don't name due to our laziness 😜😜.But that functions takes the value user gives us.Then this is where shortcut happens.We create a promise and inside the promise we execute your validator function.To that functions we pass the `resolve`,`reject` and `value`.You can call resolve argument given to your function to return an output.Don't worry if you don't understand it too much if you are beginner.We know most of you can.Choose your on way to write it but don't break the validator functions architecture.

So just like this we have defined a few functions that may help you in your journey.In the next section we will explain them.Not like this.But a simple explanation.