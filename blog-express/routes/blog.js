var express = require('express');
var router = express.Router();
const {getList,getDetail,newBlog,updateBlog,deleteBlog} = require('../controller/bolg')
const {SuccessModel,ErrorMpdel}  = require('../model/resModel')
const loginCheck = require('../middlewar/loginCheck')
/* GET home page. */
router.get('/list', function(req, res, next) {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    
    if(req.query.isadmin){

        //管理员界面 
        // const loginCheckResult = loginCheck(req)
        // if(loginCheckResult){
        //     //未登陆
        //     return loginCheckResult
        // }
        if(!req.session.username){
            res.json(
                new ErrorMpdel('未登陆')
            )
            return
        }

        //  强制查自己的博客
        author = req.session.username

    }
    
    
    const data = getList(author,keyword)
    return data.then(result=>{
        res.json(new SuccessModel(result))
    })
});
router.get('/detail', function(req, res, next) {
    const data = getDetail(req.query.id)
        return data.then(result=>{
            // console.log('shaa',result)
            res.json(new SuccessModel(result))
            // return new SuccessModel(result)
        })
  
});

router.post('/new',loginCheck,(req,res,next)=>{
    
        req.body.author = req.session.username//加数据
        const blogData = req.body
        const data = newBlog(blogData)
        return data.then(result=>{
            res.json(
                new SuccessModel(result) 
            ) 
        }) 
})

router.post('/update',loginCheck,(req,res,next)=>{
    const data = updateBlog(req.query.id,req.body)
    return data.then(result=>{
        if(result){
            res.json(
                new SuccessModel()
            ) 
        }else{
            res.json(
                new ErrorMpdel('更新博客失败')
            )
        }

    })
})


router.post('/del',loginCheck,(req,res,next)=>{
    const author = req.session.username
        const data = deleteBlog(req.query.id,author)
        
        return data.then(result=>{
            if(result){
                res.json(new SuccessModel()) 
            }else{
                res.json(new ErrorMpdel('删除失败')) 
            }

        })
})
module.exports = router;
