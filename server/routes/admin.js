const express = require("express");
const router = express.Router();
const { isloggedin, isAdmin } = require("../middleware");
const { route } = require("./listing");
const User=require("../models/users");
const adminController=require("../controller/admin");

//Dashboard
router.get("/dashboard",isAdmin,isloggedin,adminController.getDashboard);


//User panel
router.get("/users",isAdmin,isloggedin,adminController.getUsers);


//Promote user
router.post("/users/:id/promote",isloggedin,isAdmin,adminController.promoteUser);


//Demote user
router.post("/users/:id/demote",isloggedin,isAdmin,adminController.demoteUser);


//Delete user
router.delete("/users/:id",isloggedin,isAdmin,adminController.deleteUser);

module.exports=router;