// 用于表格的vue扩展，可搜索、分页
var Tvm = Vue.extend({
    data: function(){
        return ({
        	JSON: JSON,
        	keyword: "",
			usersDataSource: [],
			usersDataSource_filter: [],
			pageIndex: 1
        })
    },
    methods: {
        stamp2time: stamp2time
    }
});
// 时间戳转化为时间
function stamp2time(stamp) {
    var time = new Date(stamp);
    var year = time.getFullYear();
    var month = time.getMonth() - 0 + 1;
    month = month < 10 ? "0" + month : month;
    var day = time.getDate();
    day = day < 10 ? "0" + day : day;
    var hour = time.getHours();
    var minute = time.getMinutes();

    var now = new Date();
    var nowyear = now.getFullYear();
    var nowmonth = now.getMonth() - 0 + 1;
    nowmonth = nowmonth < 10 ? "0" + nowmonth : nowmonth;
    var nowday = now.getDate();
    var timeString = '';
    //if (year != nowyear) {
        return year + "-" + month + "-" + day;
    //} else {
    //    // 今年
    //    if (month == nowmonth && day == nowday) {
    //        // 说明是今天
    //        return hour + ":" + minute;
    //    } else {
    //        return month + "-" + day;
    //    }
    //}
}