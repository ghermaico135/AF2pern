import express from 'express';
import {getAllEmployee,createEmployee} from "../controller/EmployeController.js"

const route = express.Router();

route.get("/",getAllEmployee)

route.post("/emp", createEmployee);

export default route;