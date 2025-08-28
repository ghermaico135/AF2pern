import Router from "express";
import {getAllUsers, register,login,logout,authStatus,setup2FA,verify2FA,reset2FA } from "../controller/authController.js";
import passport from "../config/passportConfig.js"

const router = Router();

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Unauthorized" });
};


router.get("/", getAllUsers)

router.post("/register", register)

router.post("/login", passport.authenticate('local', { failureRedirect: '/login' }), login)

router.get("/status",  authStatus)

router.post("/logout",  logout)

//adding authentication middle ware
router.post("/2fa/setup",isAuth, setup2FA)

router.post("/2fa/verify",isAuth, verify2FA )

router.post("/2fa/reset",isAuth, reset2FA )

export  default router;