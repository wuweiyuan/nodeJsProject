const fs = require('fs')
const path = require('path')


const fileName = path.resolve(__dirname,'data.txt')


//读取文件内容
// fs.readFile(fileName,(err,data)=>{
//     if(err){
//         console.error(err)
//         return 
//     }
//     //data  是二进制的，所以要toString
//     console.log(data.toString())
// })

//写入文件
// const content = '这是写入的内容'
// //这是写入的配置
// const opt = {
//     flag:'a' //追加是a覆盖是w
// }


// fs.writeFile(fileName,content,opt,err=>{
//     if(err){
//         console.err(err)
//     }
// })




//判断文件是否存在
// fs.exists(fileName,exists=>{
//     console.log('exists',exists)
// })