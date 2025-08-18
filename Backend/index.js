import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"
// import { db } from './utils/connectToDB.js';

const app = express()
const PORT = process.env.PORT || 5000

const corsOption={
    origin:"*"
}

app.use(cors(corsOption))
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res)=>{
    req.statusCode(404).json({error:"Page isn't found"})
})

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    return res.statusCode(statusCode).json({error:message})
})

// db.connect().then(()=>{
//     console.log("connected with database")
// }).catch((err)=>{
//     console.log("couldn't connect with database" ,err)
// })

// db.on("error" ,err =>{
//     console.log("database error",err)
//     process.exit(1)
// })

app.listen( PORT, ()=>{
    console.log(`Server listens at port ${PORT}`)
    
})