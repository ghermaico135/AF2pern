import { createErrors } from "../config/error.js"
import {query} from "../config/connectToDB.js"
import { createTableUser,getAllUsersQuery,createUserQuery} from "../model/sqlUser.js";
import bcrypt from "bcryptjs"

export const getAllUsers = async(req,res,next) =>{
    try{
        const response = await query(`SELECT to_regclass('users')`)
        if(!response.rows[0].to_regclass) {
            await query(createTableUser)
        }

        const {rows} = await query(getAllUsersQuery)
        console.log(rows)
        res.status(200).json({message:"The table creates successfully",rows:rows})

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
           isMfactive : req.user.isMfactive
        })
}
export const authStatus = async(req,res,next) =>{
        if(req.user){
            res.status(200).json({
                message:"User logged in success",
                username:req.user.username,
                isMfactive:req.user.isMfactive
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

}
export const verify2FA = async(req,res,next) =>{

}
export const reset2FA  = async(req,res,next) =>{

}
