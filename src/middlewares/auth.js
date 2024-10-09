const userAuth = (req,res,next) => {
    console.log('User Auth is being checked');
    const token = "abc"
    const isAuthorizedToken = token === "abc"
    if(!isAuthorizedToken){
        res.status(401).send('Unauthorized')
    } else {
        next()
    }
}

const adminAuth = (req,res,next) => {
    console.log('Admin Auth is being checked');
    const token = "abc"
    const isAuthorizedToken = token === "abc"
    if(!isAuthorizedToken){
        res.status(401).send('Unauthorized')
    } else {
        next()
    }
}

module.exports = { userAuth, adminAuth}