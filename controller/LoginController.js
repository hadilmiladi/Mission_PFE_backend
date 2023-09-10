
const jwt =require('jsonwebtoken');
const db= require('../models')




const loginEmployee = async (req,res) =>{
    try {
        // attributs
        const { email } = req.params;
        console.log('emailllllllllllllllllllllaaaaaaaaaaaaaaaaaaaaaaa',email)
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
        let role=(item.rank.permission);
        console.log('role11111',role)
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
          case "chef du projet":
            role="chef du projet";
            break;
        }
        if (!item) {
            return res.status(404).json({ error: "item doesnt exist" })
        }
        console.log("item.rank.permission",item.rank.permission)
        const token =await jwt.sign({id:item.id,role},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"7d"
        })
        console.log("role",role)
        return res.status(200).json({ message: "loggd in successfully",role,token });
    } catch (error) {
        console.log("erro: ", error)
        return res.status(500).json({ error: "server error" })
    
}

    };

    module.exports={
        loginEmployee
    }; 