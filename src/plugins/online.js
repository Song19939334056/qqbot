const {saveImage, judgeFileExist, getFilePath} = require("../tools/file")

const getTimeHourse = require('../tools/time.js').getTimeHourse

function OnMessageOnline(msg, client) {
    console.log('登陆成功！')
    setInterval(() => {
     const timeType = getTimeHourse()
      let title = ''
     if(timeType === '夜晚') {
      title = 'kunle'
     } else if(timeType === '深夜') {
      title = 'shuile'
     } else if(timeType === '早上') {
      title = 'xingle'
     } else if(timeType === '正常') {
      title = 'huanying'
     }
     let pic = getFilePath('../../', `/src/assets/Avatar/${title}.jpg`)
     client.setAvatar(pic)
    }, 1000);
}

module.exports = {
    OnMessageOnline
}
