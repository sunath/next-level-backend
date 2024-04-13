# Predefined validators 

1. Is Required Validator

Is required validators just checks weather you give a null or undefined value.It helps us prevent errors that could happen in next validators most of the time.

```javascript
const {validators} = require("fast-express-backend/dataclasses")
const validator = validators.is_required("This is required")
validator(null).then(e => console.log(e))
```

2. MinLength  Validator
Check whether the given value has the minimum amount of characters.

```javascript
const {validators} = require("fast-express-backend/dataclasses")
const validator = validators.minLength(4,"This must have 4 or more characters")
validator("fuc").then(e => console.log(e))
```


3. MaxLength Validator
If the string surpass the amount of characters it should have , this validator is there to make sure the request does not go far.

```javascript
const {validators} = require("fast-express-backend/dataclasses")
const validator = validators.maxLength(10,"Only 10 characters can be entered")
validator("fucdndbewbdhevhdhevfgvegvfegvge").then(e => console.log(e))
```

Since the library is under construction , we haven't add more , but soon we will add more validators.Don't loose hope.Anyway now you are capable of creating your own validators right😁😁😁😁?
