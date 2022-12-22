var fs = require('fs');
var https = require('https')
var path = require('path');
//保存图片
function saveImage(url,path) {
    https.get(url,function (req,res) {
        var imgData = '';
        req.on('data',function (chunk) {
            imgData += chunk;
        })
        req.setEncoding('binary');
        req.on('end',function () {
            fs.writeFile(path,imgData,'binary',function (err) {
                console.log('保存图片成功'+path)
            })
        })
    })
}
//判断文件是否存在
function judgeFileExist(fileUrl) {
    return new Promise((resolve, reject) => {
        fs.access(fileUrl, fs.constants.F_OK, (err) => {
          if (err) { // 文件存在时err = false；文件不存在时err = true
            resolve(false);
          } else {
            resolve(true);
          }
        });
    })
  }
// 获取文件路径
function getFilePath(path1,path2) {
   return path.join(path.resolve(__dirname, path1) + path2)
  }
module.exports = {
    saveImage,
    judgeFileExist,
    getFilePath
}