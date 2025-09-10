import bcrypt from "bcryptjs"
import speakeasy from "speakeasy"
import qrcode from "qrcode"
import jwt from "jsonwebtoken"
import { createErrors } from "../config/error.js"
import {query} from "../config/connectToDB.js"
import { createTableUser,getAllUsersQuery,createUserQuery,updateQuery,getTempFactorSecret,
    updateVerifiedQuery,updateVerifyResetQuery} from "../model/sqlUser.js";


export const getAllUsers = async(req,res,next) =>{
    try{
        const response = await query(`SELECT to_regclass('users')`)
        if(!response.rows[0].to_regclass) {
            await query(createTableUser)
        }

        const {rows} = await query(getAllUsersQuery)
        console.log(rows)
       return  res.status(200).json({message:"The table creates successfully",rows:rows})

    }catch(error){
          console.error(error)
        next(createErrors(500,"Internal error"))
    }
}

export const register = async(req,res,next) =>{
        try{
            const {username,password} = req.body;
                 if(!username || !password){
                     return res.status(400).json({error:"Missing field"})
                 }

            const hashPassword = await bcrypt.hash(password,10)
        
            const newUser = await query(createUserQuery, [username,hashPassword])
                console.log(newUser);
            return res.status(201).json(newUser.rows[0]);

        }catch(error){
            console.error(error)
            next(createErrors(500,"Internal error"))
        }
}

export const login = async(req,res,next) =>{
        console.log("The authentiated user is", req.user)
        res.status(200).json({
            message:"user logged in successfully",
            username:req.user.username,
           is_mf_active : req.user.is_mf_active
        })
}
export const authStatus = async(req,res,next) =>{
        if(req.user){
            res.status(200).json({
                message:"User logged in success",
                username:req.user.username,
               is_mf_active:req.user.is_mf_active
            })
        }else{
            res.status(401).json({message:"Unauthorized user"})
        }
}
export const logout = async(req,res,next) =>{
        if(!req.user) return  res.status(401).json({message:"Unauthorized user"})
        req.logout((err) =>{
                if(err) {return res.status(400).json({message:"user not logged out"})
                }else{
                    return res.status(200).json({message:"user successfully logged out"})
                }
            })
}
export const setup2FA = async(req,res,next) =>{
    try{
        const user = req.user    //passport.js
        const secret = speakeasy.generateSecret();
         console.log("The secret object is: ",secret)

        user.two_factor_secret = secret.base32;
        const values =[ user.two_factor_secret, user.id];

        await query(updateQuery,values)

        const url = speakeasy.otpauthURL({
            secret:secret.base32,
            label:`${req.user.username}`,
            issuer:"www.miki.com",
            encoding:"base32"

        })

        const qrImageUrl = await qrcode.toDataURL(url)

        return res.status(200).json({
            secret:secret.base32,
            qrcode:qrImageUrl,
            is_mf_active:true,
        })
    }catch(error){
         console.error(error)
        next(createErrors(500,"error setting up 2FA"))
    }
       
}
export const verify2FA = async(req,res,next) =>{
    try{
         const {token} = req.body;
         console.log(token)
        const user = req.user
// get the temporay secret from DB  
    const result = await query(getTempFactorSecret,[user.id])
    const tempSecret = result.rows[0]?.two_factor_temp_secret;

     if(!tempSecret){
         return res.status(400).json({messge:" No 2fa setup found"});
    } 
        const verified = speakeasy.totp.verify({
          secret:tempSecret,
            encoding:"base32",
            token,
            window:1
    })

        if(!verified){
             return  res.status(400).json({messge:"Invalid or expired token"}) 
         }
            // 3. If verified, update DB (move temp → permanent)
            await query(updateVerifiedQuery,[tempSecret,user.id])

            // 4. Generate JWT for login session
            const jwtToken = jwt.sign({
                username: user.username},
                process.env.JWT_SECRET,
                {expiresIn:"1h"}
            )
        return  res.status(200).json({messge:"2fa successful", token:jwtToken})
    
    }catch(error){
         console.error(error)
        next(createErrors(500,"error setting up 2FA"))
    }
   
}
export const reset2FA  = async(req,res,next) =>{
    try{
        const user = req.user;
        await query(updateVerifyResetQuery,[user.id]);
         return res.status(200).json({message:"2FA reset successful"})

    }catch(error){
        console.error(error)
        next(createErrors(500,"error setting up 2FA"))

    }

}
