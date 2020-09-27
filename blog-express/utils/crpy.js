const crypto =  require('crypto')


//密钥
const mima = 'wuweiyuan999'


//md5加密
function md5(content){
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}


//加密函数
function genPassword(password){
    const   str = `password=${password}&key=${mima}`
    return md5(str)
}


module.exports = {genPassword}