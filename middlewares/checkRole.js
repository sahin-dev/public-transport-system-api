

const checkRole = (role)=>{

    return (req,res,next)=>{
        const user = req.user;
        if(role === user.role){
            next();
        }else{
            next(createError(401,"Not authorized"));
            return;
        }
    }
}

module.exports = checkRole;