"use strict";
const jwt = require("jsonwebtoken")
const db = require("../models")

const verifyAccess=async(req,res,next)=>{
   // ** check if there's a token
   const authHeader = req.headers.authorization || req.headers.Authorization;
   if (!authHeader?.startsWith("Bearer ")) {
     return res.status(401).json({ Message: "no token!", Success: false }); // **There's no token
   }
   const token = authHeader.split(" ")[1];
   try {
     // ** decode token
     const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     if(decodedToken.role==="admin"){
      console.log("admin")
     }
     else if(decodedToken.role==="employee"){
      const item = await db.employee.findOne(
        {where:{id:decodedToken.id}}
       )
       req.employee = item;
     }
     else if(decodedToken.role==="ceo"){
      const item = await db.employee.findOne(
        {where:{id:decodedToken.id}}
       )
       req.employee = item;
     }
     else{
      return res.status(403).json({ message: "unknown role" });
     }
     next();
   } catch (error) {
     // ** Expected error is token not valid
     console.log("############: ", error);
     return res.status(403).json({ message: "Failed to verify user" });
   }
}
module.exports=verifyAccess