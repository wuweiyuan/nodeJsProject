//  process.stdin.pipe(process.stdout)
 







//复制文件

const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname,'data.txt')
const fileName2 = path.resolve(__dirname,'data-dark.txt')

const redStream = fs.createReadStream(fileName1)
const writeStream = fs.createWriteStream(fileName2)

redStream.pipe(writeStream)

redStream.on('end',()=>{
    console.log('复制完成')
})