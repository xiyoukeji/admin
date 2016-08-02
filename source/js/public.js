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
    // eventBind 仅进行一次
	// 页面刷新 hash变化时的处理
	$(window).bind('load hashchange', loadContent);
	$(window).bind('resize',windowReset);
    $(window).bind('click', function(){
        $("[data-autoCloseWhenWindowClick]").hide();
    })
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
        var $this = $(this);
        var $input = $(this).children('input');
        var params = $this.attr('data-params');
        var regx = /<js>(.*?)<\/js>/g;

        if(!$input.siblings('.admin_ui_input_autoComplete_selectBox').length){
            $input.after('<div class="admin_ui_input_autoComplete_selectBox" data-autoCloseWhenWindowClick></div>');
        }
        var selectBox = $input.siblings(".admin_ui_input_autoComplete_selectBox");
        var timeout;
        $input.bind('input',function(){
            var keyword = $.trim($input.val());
            if(keyword!=""){
                var _params = params;
                do{
                    var matchArr = regx.exec(params);
                    matchArr&&(_params = _params.replace(/<js>.*?<\/js>/,eval(matchArr[1])));
                }while(regx.lastIndex);
                _params = JSON.parse(_params);
                timeout&&clearTimeout(timeout);
                timeout = setTimeout(function(){
                    selectBox.empty().hide();
                    $.ajax(_params).done(function(data){
                        if(data.state == 0){
                            var textArr = data.data;
                            if(textArr.length > 0){
                                for(var i = 0, length = textArr.length; i < length; i++){
                                    var line = $('<div class="line">'+
                                                    textArr[i]+
                                                '</div>');
                                    line.bind('click',function(){
                                        if(!$this.siblings('.admin_ui_input_tagBox').length){
                                            $this.before('<div class="admin_ui_input_tagBox"></div>');
                                            $this.siblings('.admin_ui_input_tagBox').on('click','.admin_ui_colorLabel',function(){
                                                $(this).remove();
                                            });
                                        }
                                        var tagBox = $this.siblings('.admin_ui_input_tagBox');
                                        var length = length = tagBox.children('.admin_ui_colorLabel').length;
                                        if(length){
                                            for(var k = 0; k < length; k++){
                                                if(tagBox.children('.admin_ui_colorLabel').eq(k).text() == $(this).text()){
                                                    break;
                                                }
                                                if(k == length-1){
                                                    tagBox.append('<div class="admin_ui_colorLabel">'+$(this).text()+'</div>');
                                                }
                                            }
                                        }
                                        else{
                                            tagBox.append('<div class="admin_ui_colorLabel">'+$(this).text()+'</div>');
                                        }  
                                    });
                                    selectBox.append(line);
                                }
                                selectBox.show();
                            }
                            else{
                                var line = '<div class="line" onclick="return false">'+
                                                '无搜索结果'+
                                            '</div>';
                                selectBox.append(line);
                            }  
                        }
                    }).fail(function(data){
                        console.log(data);
                    });
                }, 500);
            }
            else{
                selectBox.empty().hide();
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








