
const {getList,getDetail,newBlog,updateBlog,deleteBlog} = require('../controller/bolg')
const {SuccessModel,ErrorMpdel}  = require('../model/resModel')
const loginCheck = (req) =>{
    if(!req.session.username){
        return  Promise.resolve(new ErrorMpdel('尚未登陆')) 
    }
}
const handleBlogRouter = (req,res)=>{
    const method  = req.method
    const id = req.query.id
    
    
    //获取博客列表
    if(method === 'GET' && req.path ==='/api/blog/list'){
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        
        if(req.query.isadmin){

            //管理员界面 
            const loginCheckResult = loginCheck(req)
            if(loginCheckResult){
                //未登陆
                return loginCheckResult
            }

            //  强制查自己的博客
            author = req.session.username

        }
        
        
        const data = getList(author,keyword)
        return data.then(result=>{
            return new SuccessModel(result)
        })
        // return new SuccessModel(listData)
        // return {
        //     msg:'这是获取博客列表的接口 '
        // }
    }
    //获取博客详情
    if(method === 'GET' && req.path ==='/api/blog/detail'){
        console.log('idididi',id)
        const data = getDetail(id)
        return data.then(result=>{
            console.log('shaa',result)
            return new SuccessModel(result)
        })
        // return new SuccessModel(data)
    }
    //新建一篇博客
    if(method === 'POST' && req.path ==='/api/blog/new'){
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            //未登陆
            return loginCheckResult
        }
        req.body.author = req.session.username//加数据
        const blogData = req.body
        const data = newBlog(blogData)
        return data.then(result=>{
            return new SuccessModel(result)
        })
        // return new SuccessModel(data)
    }
    //更新一篇博客
    if(method === 'POST' && req.path ==='/api/blog/update'){
        const data = updateBlog(id,req.body)
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            //未登陆
            return loginCheckResult
        }
        return data.then(result=>{
            if(result){
                return new SuccessModel()
            }else{
                return  new ErrorMpdel('更新博客失败')
            }

        })
    }
    //删除一篇博客
    if(method === 'POST' && req.path ==='/api/blog/del'){
        const author = req.session.username
        const data = deleteBlog(id,author)
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            //未登陆
            return loginCheckResult
        }
        return data.then(result=>{
            if(result){
                return new SuccessModel()
            }else{
                return new ErrorMpdel('删除失败')
            }

        })
        
    }
}

module.exports = handleBlogRouter 