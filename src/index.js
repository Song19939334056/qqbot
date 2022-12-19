const { createClient } = require("oicq")
const account = 647666737
const client = createClient(account)

client.on("system.online", () => console.log("Logged in!"))
const OnMessageReceive = require('./plugins/message.js').OnMessageReceive;
const FriendMessage = require('./plugins/friendMessage.js').FriendMessage;
client.on('message',OnMessageReceive);

client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()