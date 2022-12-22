function getTimeHourse  () {
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
module.exports = {
    getTimeHourse
}