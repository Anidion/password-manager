const jwt = require("jsonwebtoken");

// middleware function to handle JWT verification for updating users and getting users
async function authMiddleware(req, res, next) { 
    console.log("In authentication middleware")
    
    // Extract the token from the request headers
    const bearerHeader = req.headers['authorization']
    if (bearerHeader == null)
        return res.status(401).send('Unauthorized') 

    const token = bearerHeader.replace("Bearer ","");
    console.log(bearerHeader)
    //Verify the input token 
    jwt.verify(token, process.env.JWT_SECRET, (err, jwtPayload) => {
        if (err) {
            console.log(err.message)
            res.status(401).send("Not authorized to perform this action")
        }
        else {
            // If token is verified, extract the user's email from the payload and call the next function
            req.userEmail = jwtPayload.email
            console.log(`Found user email in JWT payload: ${req.userEmail}`)
            next()
        }
    })
    
}

module.exports = {
  authMiddleware,
};
