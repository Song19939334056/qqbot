const { createClient } = require("oicq")
const account = 647666737
const client = createClient(account)

const OnMessageReceive = require('./plugins/message.js').OnMessageReceive;
const OnMessageOnline = require('./plugins/online.js').OnMessageOnline;
client.on('message',(msg)=>OnMessageReceive(msg,client));
client.on('system.online',(msg)=>OnMessageOnline(msg,client));


client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()