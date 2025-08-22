import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local"
import bcrypt from "bcryptjs";

import { createErrors } from "../config/error.js"
import {query} from "../config/connectToDB.js"
import { loginUserQuery,getSepecificUserQuery} from "../model/sqlUser.js";


 passport.use(
    new LocalStrategy(async (username, password, done) => {
        try{
            const result = await query(loginUserQuery,[username]).rows[0]
            const user = result.rows[0];
            console.log("user retrived from" ,user)
            if(!user) return done(null,false,{message:"User not found"})
            
            const isMatch = await bcrypt.compare(password,user.password)

            if(isMatch) return done (null,user)
            else return done(null,false,{message:"Incorrect password"})

        }catch(err){
            console.error(err)
            done(createErrors(500,"Internal server error"))
        }
    }
));


passport.serializeUser((user,done) =>{
    done(null,user.id)
})

passport.deserializeUser(async (id,done) =>{
    try{
        console.log("We are inside deserailizerUser")
        const user = await query(getSepecificUserQuery,[id])
        done(null,user)
    }catch(err){
         console.error(err)
            done(createErrors(500,"Internal server error"))
    }
})
export default passport;
