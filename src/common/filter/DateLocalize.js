var days = '日月火水木金土'

export default function (value) {
  var date = new Date(value)
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  } else {
    var hours = date.getHours()
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + (hours >= 12 ? '午後' : '午前') + (((hours + 11) % 12) + 1) + '時' + date.getMinutes() + '分 ' + days[date.getDay()] + '曜日'
  }
}
