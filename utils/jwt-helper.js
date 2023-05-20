const jwt =require ('jsonwebtoken')

exports.jwtTokens=({id,nom,matricule,email}) =>{
    const user ={id,nom,matricule,email}
    const accessToken =jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'20s'}); //in real life it expires in 15min
    const refreshToken =jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'20s'}); //in real life it expires in 15days
    return ({accessToken, refreshToken})
}

