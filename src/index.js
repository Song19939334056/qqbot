const { createClient } = require("oicq")
var path = require('path');
const account = 647666737
const client = createClient(account)

let getTimeStata = () => {
  let timeNow = new Date()
  let hours = timeNow.getHours()
  let text = ''
  if(hours>=18&&hours<=24) {
      text = '夜晚'
  } else if(hours>=0&&hours<7) {
      text = '深夜'
  } else if(hours>=7&&hours<12) {
      text = '早上'
  } else {
      text = '正常'
  }
  return text
}

client.on("system.online", () => console.log("Logged in!"))
const OnMessageReceive = require('./plugins/message.js').OnMessageReceive;
client.on('message',(msg)=>OnMessageReceive(msg,client));
client.on('system.online',(msg)=>{
  setInterval(() => {
   const timeType = getTimeStata()
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
   let pic = path.resolve(__dirname, '../') + `/src/acts/${title}.jpg`
   client.setAvatar(pic)
  }, 1000*60);
});





client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()