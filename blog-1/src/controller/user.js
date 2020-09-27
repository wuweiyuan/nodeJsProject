const {exec,excape}  =require('../db/mysql')
const {genPassword} = require('../utils/crpy')
const login = (userName,passWord)=>{
    userName = excape(userName)
    passWord = genPassword(passWord)
    passWord = excape(passWord)
    //生成加密密码
    let sql =  `select username, realname from users where username=${userName} and password=${passWord}`
    return exec(sql).then(result=>{
        return result[0] ||{}
    })
    
}

module.exports = {login}