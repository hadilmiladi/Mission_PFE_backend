const base = require("../cnxDB");
const jwt =require('jsonwebtoken');
const { jwtTokens } =require("../utils/jwt-helper");
const db= require('../models')
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;


/* 
// Configure Microsoft login strategy
passport.use(
  new OIDCStrategy(
    {
      clientID: '04ac260d-b5ff-4343-85d8-ea393c66afc0',
      clientSecret: 'd3f700ea-0b2c-4cbc-a988-158439663203',
      identityMetadata: 'https://login.microsoftonline.com/298fe323-14d7-4887-81aa-86e61b43e140/v2.0/.well-known/openid-configuration',
      responseType: 'id_token',
      responseMode: 'form_post',
      redirectUrl: 'https://localhost:3000/login',
      validateIssuer: false,
      passReqToCallback: false,
      scope: ['openid', 'profile', 'email'],
    },

    async (iss, sub, profile, accessToken, refreshToken, done) => {
      try {
        // Retrieve user information from the "profile" object
        const { oid, displayName, emails } = profile;
        const email = emails[0].value;

          // Check if the email contains "nexus"
         if (!email.includes('nexus')) {
          return done(null, false, { message: 'Only users with email containing "nexus" can login' });
        }
 
        // Find or create the user in your database based on the authenticated user's information
        let user = await db.User.findOne({ where: { email } });
        if (!user) {
          // Create a new user if it doesn't exist
          user = await db.User.create({ email, name: displayName });
        }

        // Generate and return a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '7d',
        });

        // Call the "done" callback with the authenticated user object
        done(null, { id: user.id, email: user.email, token });
      } catch (error) {
        done(error);
      }
    }
  )
);

const loginEmployee = [
  passport.authenticate('azuread-openidconnect', { session: false }),
  async (req, res) => {
    try {
      // Check if authentication was successful
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }

      // Find or create the user in your database based on the authenticated user's information
      const { id, name, email } = req.user;

      // Example: Find the employee by email
      const item = await db.employee.findOne({
        where: {
          email,
        },
        include: [
          {
            model: db.rank,
            attributes: ['name', 'permission', 'perdiem'],
          },
        ],
      });

      // Check if the employee exists
      if (!item) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Generate JWT token with role based on employee's rank permission
      let role;
      switch (item.rank.permission) {
        case 'admin':
          role = 'admin';
          break;
        case 'user':
          role = 'employee';
          break;
        case 'ceo':
          role = 'ceo';
          break;
      }

      const token = jwt.sign({ id: item.id, role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '7d',
      });

      // Return the token and role to the client
      return res.status(200).json({ message: 'Logged in successfully', role, token });
    } catch (error) {
      console.log('error: ', error);
      return res.status(500).json({ error: 'Server error' });
    }
  },
];

module.exports = {
  loginEmployee,
};

 */













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