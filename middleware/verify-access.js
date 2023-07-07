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
     const item = await db.employee.findOne(
      {where:{id:decodedToken.id}}
     )
     if(!item){
      return res.status(403).json({ message: "unknown role" });
     }
     req.employee = item;
     next();
   } catch (error) {
     // ** Expected error is token not valid
     console.log("############: ", error);
     return res.status(403).json({ message: "Failed to verify user" });
   }
}
module.exports=verifyAccess