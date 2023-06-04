const base = require("../cnxDB");
const jwt =require('jsonwebtoken');
const { jwtTokens } =require("../utils/jwt-helper");
const db= require('../models')

const loginEmployee = async (req,res) =>{
    try {
        // attributs
        const { email } = req.params;
        // retrieve 
        const item = await db.employee.findOne({
          where: {
            email,
          },
          include: [
            {
              model: db.rank,
              attributes: ["name", "permission", "perdiem"],
            },
          ],
        });
        let role;
        switch(item.rank.permission){
          case "admin":
            role="admin";
            break;
          case "user":
            role="employee";
            break;
          case "ceo":
            role="ceo";
            break;
        }
        if (!item) {
            return res.status(404).json({ error: "item doesnt exist" })
        }
        const token =await jwt.sign({id:item.id,role},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"7d"
        })
        return res.status(200).json({ message: "loggd in successfully",role,token });
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    
}
    };

    module.exports={
        loginEmployee
    };