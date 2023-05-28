const express = require("express");
const app = express();
const cors= require("cors")
const path = require("path")

require('dotenv').config();
const PORT = process.env.PORT || 4000;

//cookie-parser - what is this and why we need this ?

const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname ,"./client/build")))

require("./config/database").connect();

//route import and mount
const user = require("./routes/user");
const myCategoryRoute =require("./routes/myCategoryRoute")
const productRouter =require("./routes/productRouter")

app.use("/api/v1", user);
app.use("/api/v1/category", myCategoryRoute);
app.use("/api/v1/products",productRouter)


app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

//actuivate

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})