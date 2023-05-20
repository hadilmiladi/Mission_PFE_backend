const base = require("../cnxDB");
const jwt =require('jsonwebtoken');
const { jwtTokens } =require("../utils/jwt-helper");

exports.Login = async (req, res) => {
    try {
        const email = req.params.email;
        const users= await base.query("SELECT * FROM employee WHERE email = $1", [email])
        if(users.rows.length ===0 )return res.status(401).json({ message: "user does not exist"});
        else {
            let tokens=jwtTokens(users.rows[0]);
           let coookie= res.cookie('refresh_token',tokens.refreshToken,{httpOnly:true})
            console.log(tokens)
            res.status(200).json(users.rows[0]);
            
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}
