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
    // import the express libary and init  the app instance 
    const express = require("express");
    const app  = express();
    ```
	 Then let's define the port and write the code to start the server
	 
	 ```javascript 
    app.listen(() => {
    console.log("App is live.It's running on port 8000")
    },8000)
	 ```
	 `

