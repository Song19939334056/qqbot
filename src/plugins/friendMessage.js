const { createClient } = require("oicq")
const client = createClient(647666737)
const User = client.pickUser()

module.exports = {
    FriendMessage
}

function FriendMessage(msg){
    console.log(User.getSimpleInfo())
}