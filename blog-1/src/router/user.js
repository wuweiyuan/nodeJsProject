const {login} = require('../controller/user')
const {SuccessModel,ErrorMpdel}  = require('../model/resModel')
const {set} = require('../db/redis')
//获取cookie过期时间

const handleUserRouter = (req,res)=>{
    const method  = req.method
    const {username,password} = req.body
    // const {username,password} = req.query
    if(method === 'POST'&& req.path==='/api/user/login'){
         //登陆 
        const data = login(username,password)
        return data.then(result=>{
            if(result.username){

                req.session.username = result.username
                req.session.realname  = result.realname
                set(req.sessionId,req.session)
                console.log('看看session',req.session)
                return new SuccessModel()
            }
            return new ErrorMpdel('登陆失败')
        })

    }

    //登陆验证的测试
    // if(method ==='GET' && req.path==='/api/user/login-test'){
    //     if(req.session.username){
    //         return Promise.resolve(new SuccessModel({
    //             session:req.session
    //         })) 
    //     }
    //     return  Promise.resolve(new ErrorMpdel('尚未登陆')) 
    // }
    
    

}

module.exports = handleUserRouter