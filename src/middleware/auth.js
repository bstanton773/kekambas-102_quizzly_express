const jwt = require('jsonwebtoken');
const unprotectedRoutes = [
    "/auth/register",
    "/auth/login",
    "/graphql"
];


const authenticate = async (req, res, next) => {
    const token = req.cookies?.jwtToken || ""

    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log('User verification successful');
        req.verifiedUser = verified;
        next()
    } catch(err) {
        console.log('User verification failed');
        if (unprotectedRoutes.includes(req.path)){
            next()
        } else {
            res.redirect('/auth/login')
        }
    }
}

module.exports = { authenticate }
