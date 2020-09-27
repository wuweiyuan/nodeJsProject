const router = require('koa-router')()
const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/bolg')
const { SuccessModel, ErrorMpdel } = require('../model/resModel')
const loginCheck = require('../middlewar/loginCheck')
router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''

    if (ctx.query.isadmin) {

        //管理员界面 
        // const loginCheckResult = loginCheck(req)
        // if(loginCheckResult){
        //     //未登陆
        //     return loginCheckResult
        // }
        if (!ctx.session.username) {
            ctx.body = new ErrorMpdel('未登陆')
            return
        }

        //  强制查自己的博客
        author = ctx.session.username

    }


    const data = await getList(author, keyword)

    // res.json(new SuccessModel(result))
    ctx.body = new SuccessModel(data)

})

router.get('/detail', async function (ctx, next) {
    const data = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)


});


router.post('/new',loginCheck,async(ctx,next)=>{
    
    ctx.request.body.author = ctx.session.username//加数据
    const blogData = ctx.request.body
    const data = await newBlog(blogData)
    ctx.body = new SuccessModel(data) 
    
})


router.post('/update',loginCheck,async(ctx,next)=>{
    const data = await updateBlog(ctx.query.id,ctx.request.body)
    
        if(data){
            ctx.body = new SuccessModel()
        }else{
            ctx.body = new ErrorMpdel('更新博客失败')
        }

    
})


router.post('/del',loginCheck,async(ctx,next)=>{
    const author = ctx.session.username
        const data = await deleteBlog(ctx.query.id,author)
        
        
            if(data){
                ctx.body= new SuccessModel()
            }else{
                ctx.body = new ErrorMpdel('删除失败')
            }

        
})


module.exports = router
