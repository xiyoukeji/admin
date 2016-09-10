$.ajaxSetup({
	success: function(data){
		if(data.state != 0){
			// 对非成功的处理
		}
	},
	error: function(){
	}
});
function getUsers(){
	var ajax = $.ajax({
		url: "../source/JSON/users.json",
		type: "GET"
	});
	return ajax;
}