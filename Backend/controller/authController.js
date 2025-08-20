import { createErrors } from "../utils/error.js"
import {query} from "../utils/connectToDB.js"
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
    try{
        const {username, password} = req.body
        if(!username || !password){
             return res.status(400).json({error:"Missing field"})
        }
       

    }catch(error){
         console.error(error)
        next(createErrors(500,"Internal error"))
    }

}
export const authStatus = async(req,res,next) =>{

}
export const logout = async(req,res,next) =>{

}
export const setup2FA = async(req,res,next) =>{

}
export const verify2FA = async(req,res,next) =>{

}
export const reset2FA  = async(req,res,next) =>{

}
