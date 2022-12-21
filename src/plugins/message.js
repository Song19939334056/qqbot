
module.exports = {
    OnMessageReceive
}
var fs = require('fs');
var https = require('https')
var path = require('path');
const { segment } = require("oicq")
var dir = path.join(path.resolve(__dirname, '../../') + '/src/personPic/');
const songList  = [
    {
        id:'327052525',
        title:'愿君长似少年时，初心不忘乐相知。'
    },
    {
        id:'237954579',
        title:'我写了一首诗，我不敢写的是你的名字。'
    },
    {
        id:'202793898',
        title:'不要因为别人的几句话、几个表情、几个举止，而影响到自己的心情，希望你醒来的每一天，心情都充满阳光。'
    },
    {
        id:'101829603',
        title:'所有的人和事，自己问心无愧就好，不是你的也别强求，反正离去的都是风景，留下的才是人生。'
    },
    {
        id:'4829067',
        title:'生活很简单，喜欢什么就要付出努力去争取什么，但愿所有的努力都不会白费，但愿纷扰过后能够梦想成真。'
    },
]

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

function OnMessageReceive(msg, client){
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
            case '添加好友':
            case '加qq':
            case '加QQ':
            case '加我好友':
            case '加我qq':
            case '加我QQ':
                member.is_friend?'':member.addFriend()
                msg.reply('请同意', true);
                break;
            case '禁言':
                // 判断权限
                poweDo?atList.map(item=>{group.muteMember(item.qq)}):msg.reply('没有权限', true);
                break;
            case '认证':
            case '自拍认证':
                if(fileList.length>1){
                    msg.reply('图片太多了，一张就行', true)
                    return
                }else{
                    saveImage(fileList[0].url,dir+user_id+'.jpg')
                }
                break;
            case '查证':
            case '查看认证':
                const picPath = path.resolve(__dirname, '../../') + `/src/personPic/${atList[0].qq}.jpg`
                judgeFileExist(picPath).then(err=>{
                    console.log(err ? '文件存在' : '文件不存在')
                    if(err) {
                        const message = [
                            "完成",
                            segment.face(66),
                            segment.image(picPath)
                        ]
                        msg.reply(message, true);
                    }else{
                        msg.reply(atList[0].text+'用户未认证', true);
                    }
                })
                break;
            case '社会主义核心价值观':
                const hxjzg = path.resolve(__dirname, '../../') + `/src/personPic/640.jpg`
                judgeFileExist(hxjzg).then(err=>{
                 console.log(err ? '文件存在' : '文件不存在')
                 if(err) {
                      const message = [segment.image(hxjzg)]
                      msg.reply(message, false);
                   }
                 })
                break;
            case '骰子':
                const dice = [
                    segment.dice(2)
                ]
                msg.reply(dice, true);
                break;
            case '猜拳':
                const rps = [
                    segment.rps()
                ]
                msg.reply(rps, true);
                break;
            case '开e':
            case '我emo了':
            case 'e了':
            case '我e了':
            case '给我加加油吧':
            case 'emo了':
            case 'emo':
            case 'e':
                const emoPic = path.resolve(__dirname, '../../') + `/src/acts/emo.jpg`
                client.setAvatar(emoPic)
                var element = songList[Math.floor((Math.random()*songList.length))]
                group.shareMusic("qq",element.id)
                const message = [
                    element.title,
                    segment.image(emoPic),
                  ] 
                msg.reply(message, false);
                break;
        }
    } else {
        if(message_type === 'private') {
            switch (mts){
                case '认证':
                    if(fileList.length>1){
                        msg.reply('图片太多了，一张就行', true)
                        return
                    }else{
                        saveImage(fileList[0].url,dir+user_id+'.jpg')
                        msg.reply('完成', true)
                    }
                    break;
                case '丽丽,我emo了':

                    break;
                case '查证'||'查看认证':
                    const picPath = path.resolve(__dirname, '../../') + `/src/personPic/${user_id}.jpg`
                    judgeFileExist(picPath).then(err=>{
                        console.log(err ? '文件存在' : '文件不存在')
                        if(err) {
                            const message = [
                                "完成",
                                segment.face(66),
                                segment.image(picPath)
                            ]
                            msg.reply(message, true);
                        }else{
                            msg.reply(atList[0].text+'未认证', true);
                        }
                    })
                    break;
                case '点赞':
                    friend.thumbUp()
                    msg.reply('完成', true);
                    break;
                case '开e':
                    const emoPic = path.resolve(__dirname, '../../') + `/src/acts/emo.jpg`
                    client.setAvatar(emoPic)
                    var element = songList[Math.floor((Math.random()*songList.length))]
                    friend.shareMusic("qq",element.id)
                    const message = [
                        element.title,
                        segment.image(emoPic),
                      ] 
                    msg.reply(message, false);
                    break;
            }
        }
    }
}