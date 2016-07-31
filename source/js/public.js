var ADMIN_CONFIG = {
	"homePage": "welcome.html",
	"mainBodySelector": "#admin_body",
	"headerSelector": "#admin_header",
	"contentSelector": "#admin_content",
	"leftSelector":"#admin_left"
};
$(function(){
    adminInit();
    function adminInit(){
    	eventBind();
    }

});
function eventBind(){
	// 页面刷新 hash变化时的处理
	$(window).bind('load hashchange', loadContent);
	$(window).bind('resize',windowReset);
	$(ADMIN_CONFIG.headerSelector+" .client").bind("click",function(e){
        if($(".dropdown-menu").is(":hidden")){
          	$(".dropdown-menu").show();
        }
        else{
          	$(".dropdown-menu").hide();
        }
        $(document).one("click", function(){
	        $(".dropdown-menu").hide();
	    });
        e.stopPropagation();
    });
    $(ADMIN_CONFIG.leftSelector+" .leftmenu>div>.line").bind('click',function(){
    	if($(this).next('.submenu').length){
    		// 有子菜单
    		if($(this).hasClass("active")){
    			// 打开的
    			$(this).next('.submenu').slideUp(300);
    			$(this).removeClass("active");
    		}
    		else{
    			$(this).next('.submenu').slideDown(300);
    			$(this).addClass("active");
    		}
    		
    	}
    });
}
function uiComponentEventBind(){
    $.each($("[data-autoComplete]"),function(){
        $(this).bind('input',function(){
            var $this = $(this);
            var keyword = $.trim($this.val());
            var params = $this.attr("data-params");
            var regx = /\<js\>([\s\S^(<\/js\>)]+)\<\/js\>/;
            regx.exec(params);
            if(keyword!=""){
                timeout&&clearTimeout(timeout);
                timeout = setTimeout(function(){
                    $.ajax({
                        url: url,
                        type: type,
                        data:{
                            "key":keyword
                        },
                        success: function(data){
                            switch(data.state){
                                case "0":
                                    $this.siblings(".searchResult").empty();
                                    var school=data.school;
                                    if(school.length>0){
                                        for (var i = 0, length = school.length; i < length; i++){
                                            var orderhtml=$('<li>'+
                                                '<a href="'+baseROOT+'/search.html?key='+school[i]+'">'+school[i]+'</a>'+
                                                '</li>');
                                            $this.siblings(".searchResult").append(orderhtml);
                                        }
                                        $this.siblings(".searchResult").show();
                                    }
                                    else{
                                        $this.siblings(".searchResult").hide();
                                    }
                                break;
                                default: 
                                    $this.siblings(".searchResult").hide();
                                break;
                            }
                        },
                        error: function(){
                                
                        }
                    });
                }, 300);
            }
        })
    });
}
function windowReset(){
	var h =  $(window).height()-$(ADMIN_CONFIG.headerSelector).height();
    $(ADMIN_CONFIG.contentSelector).height(h);
}
function loadContent() {
    var hash = window.location.hash;
    if (hash == "") {
        hash = "#/"+ADMIN_CONFIG.homePage;
    }
    $(ADMIN_CONFIG.contentSelector).load(hash.split("/")[1], function(){
        uiComponentEventBind();
    });
}








