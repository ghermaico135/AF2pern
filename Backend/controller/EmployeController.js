import { createErrors } from "../config/error.js"
import { query } from "../config/connectToDB.js"
import { createEmployeeTableQuery,getAllEmployeeDetail,createEmployeeDetail } from "../model/sqlUser.js"

export const getAllEmployee = async (req,res,next) =>{
    try{
        const response =await query(`SELECT to_regclass('employee_details')`)

        if(!response.rows[0].to_regclass){
            await query(createEmployeeTableQuery);
        }

        const {rows} = await query(getAllEmployeeDetail);
        console.log(rows)
        return res.status(200).json({message:"The table creates successfully",rows:rows})
    }catch(error){
        console.error(error)
        next(createErrors(500,"Fail to reterive the data"))
    }

}

export const createEmployee = async(req,res,next) =>{

    try{
        const {first_name,last_name, email,age, role,salary } = req.body;
        if(first_name == null ||last_name == null || email == null ||age == null || role == null || salary == null){
            return res.status(400).json({error:"missing fields"})
        }

        const newEmployee = await query(createEmployeeDetail,[first_name,last_name, email,age, role,salary])
        res.status(200).json(newEmployee.rows[0])
    }catch(error){
        console.error(error)
        next(createErrors(500,"Fail to reterive the data"))
    }

}
