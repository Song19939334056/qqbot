
module.exports = {
    OnMessageReceive
}
var fs = require('fs');
var https = require('https')
var path = require('path');
const { segment } = require("oicq")
var dir = path.join(path.resolve(__dirname, '../../') + '/src/personPic/');

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

function OnMessageReceive(msg){
    console.log(msg)
    const {user_id, atme, message, friend = {}, member = {}, group = {}, message_type} = msg
    const mts = message.filter(e=>{return e.type==='text'})[0].text.trim();
    const atList = message.filter(e=>{return e.type==='at'&&e.qq!=647666737});
    const fileList = message.filter(e=>{return e.type==='image'})
    const poweDo = (member.is_admin||member.is_owner)&&(group.is_admin||group.is_owner)
    console.log(mts)
    if(atme) {
        switch (mts){
            case '加好友':
                member.is_friend?'':member.addFriend()
                msg.reply('请同意', true);
                break;
            case '禁言':
                // 判断权限
                poweDo?atList.map(item=>{group.muteMember(item.qq)}):msg.reply('没有权限', true);
                break;
            case '认证':
                if(fileList.length>1){
                    msg.reply('图片太多了，一张就行', true)
                    return
                }else{
                    saveImage(fileList[0].url,dir+user_id+'.jpg')
                }
                break;
            case '查证':
                const picPath = path.resolve(__dirname, '../../') + `/src/personPic/${atList[0].qq}.jpg`
                judgeFileExist(picPath).then(err=>{
                    console.log(err ? '文件存在' : '文件不存在')
                    if(err) {
                        const message = [
                            "完成",
                            segment.face(104),
                            segment.image(picPath),
                            segment.at(10001),
                        ]
                        msg.reply(message, true);
                    }else{
                        msg.reply(atList[0].text+'用户未认证', true);
                    }
                })
                break;
        }
    } else {
        if(message_type === 'private') {
            if(mts === '点赞') {
                friend.thumbUp()
                msg.reply('完成', true);
            }
        }
    }
}