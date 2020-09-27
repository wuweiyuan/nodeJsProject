const {ErrorMpdel} = require('../model/resModel')



module.exports = async(ctx, next)=>{
    if(ctx.session.username){
        await next()
        return
    }
    ctx.body = new ErrorMpdel('未登陆')
    
}