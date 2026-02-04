require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const AuthRouter = require('./src/routes/AuthRouter.js')
require("./src/db/index.js");


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credentials:true,
})) // This middleware is used to share cross origin data from two different ports

app.use(express.json({limit:"16kb"})) // this accept the json data in the app {limit defines the size of data you accept} 
app.use(express.urlencoded({extended:true})) // this defines the data coming from url is encoded {extended defines it can pass objects also }

app.use(express.static('public')) // this helps in defining the public folder where all static files can be stored
app.use(cookieparser()) // This helps in parsing cookies 
app.use('/auth',AuthRouter)
app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.listen(PORT, () => {
  console.log("Server is running on:", PORT);
});
