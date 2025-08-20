import Router from "express";
import {getAllUsers, register,login,logout,authStatus,setup2FA,verify2FA,reset2FA } from "../controller/authController.js";

const router = Router();

router.get("/", getAllUsers)

router.post("/register", register)

router.post("/login",  login)

router.get("/status",  authStatus)

router.post("/logout",  logout)

router.post("/2fa/setup",  setup2FA)

router.post("/2fa/verify", verify2FA )

router.post("/2fa/reset", reset2FA )

export  default router;