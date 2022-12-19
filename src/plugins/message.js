
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
                console.log(err)
                console.log('保存图片成功'+path)
            })
        })
    })
}

function OnMessageReceive(msg){
    console.log(msg)
    const {user_id, atme, message, friend, member, group, message_type} = msg
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
                const message = [
                    "hello world",
                    segment.image(path.resolve(__dirname, '../../') + '/src/personPic/2272578756.jpg'),
                    segment.face(104),
                    segment.at(10001),
                ]
                msg.reply(message, true);
        }
    } else {
        if(message_type === 'private') {
            if(mts === '点赞') {
                friend.thumbUp()
                friend.thumbUp()
                friend.thumbUp()
                friend.thumbUp()
                friend.thumbUp()
                msg.reply('完成', true);
            }
        }
    }
}