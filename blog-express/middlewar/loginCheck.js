const {ErrorMpdel} = require('../model/resModel')



module.exports = (req , res , next)=>{
    if(req.session.username){
        next()
        return
    }
    res.json(
        new ErrorMpdel('未登陆')
    )
}