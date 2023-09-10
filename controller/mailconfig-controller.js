/* const { Op } = require("sequelize");
const db = require("../models");

const createAnEmail= async(req,res)=>{
    try {
        const {from,subject,body,configname}=req.body
        //create 
        const createconfig=await db.mailconfig.create({
            from,
            subject,
            body,
            configname
        })
        if(!createconfig){
            return res.status(400).json({ error: "failed to create" });
        }
        return res.status(201).json({ message: "created successfully" });
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ error: "server error" });
  }
    }
const getAll=async (req,res)=>{
    try {
        const mail=await db.mailconfig.findAll()
        if (!mail) {
            return res.status(404).json({ error: 'MailConfig not found' });
          }
          return res.status(200).json({mail})
    } catch (error) {
        console.log("error: ", error);
    return res.status(500).json({ error: "server error" });
    }
}

module.exports={
    createAnEmail, 
     getAll 
}*/