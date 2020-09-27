var express = require('express');
var router = express.Router();
const {login} = require('../controller/user')
const {SuccessModel,ErrorMpdel}  = require('../model/resModel')
/* GET home page. */
router.post('/login', function(req, res, next) {
    const {username,password} = req.body

    const data = login(username,password)
    return data.then(result=>{
        if(result.username){

            req.session.username = result.username
            req.session.realname  = result.realname
           
            // console.log('看看session',req.session)
            res.json(new SuccessModel()) 
            return
        }
        res.json(new ErrorMpdel('登陆失败')) 
    })
});

router.get('/login-test',function(req,res,next){
    if(req.session.username){
        res.json({
            error:0,
            msg:req.session
        })
        return
    }
    res.json({
        error:-1,
        msg:'登陆不成功'
    })
})


router.get('/session-test',(req,res,next)=>{
    const session = req.session
    if(session.viewNum== null){
        session.viewNum = 0
    }
    session.viewNum++
    res.json({
        viewNum:session.viewNum
    })
})
module.exports = router;
