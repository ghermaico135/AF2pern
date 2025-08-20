import express,{json,urlencoded} from 'express';
import bodyParser from 'body-parser';
import cors from "cors"
import dotenv from  "dotenv"
import session from 'express-session';
import passport from 'passport';
import routes from './routes/authRoute.js';
// import { db } from './utils/connectToDB.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000

const corsOption={
    // origin:"*"
     origin:["http://localhost:3001"],
    Credential:true
}

app.use(express.json())
app.use(cors(corsOption))
app.use(bodyParser.json()); 
app.use(json({limit:"100mb"}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencoded({limit:"100mb",extended: true}))


app.use(session({
    secret:process.env.SESSION_SECRET || "secret",
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        maxAge:60000 * 60,
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/api/auth" ,routes)




app.use((req,res)=>{
    req.statusCode(404).json({error:"Page isn't found"})
})

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"
    return res.status(statusCode).json({error:message})
})


app.listen( PORT, ()=>{
    console.log(`Server listens at port ${PORT}`)
    
})