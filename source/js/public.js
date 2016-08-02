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
        var $this = $(this);
        var $input = $(this).children('input');
        var _params = params = $this.attr('data-params');
        var regx = /<js>(.*?)<\/js>/g;
        do{
            var matchArr = regx.exec(params);
            matchArr&&(_params = _params.replace(/<js>.*?<\/js>/,eval(matchArr[1])));
        }while(regx.lastIndex);
        _params = JSON.parse(_params);
        if(!$input.siblings('.admin_ui_input_autoComplete_selectBox').length){
            $input.after('<div class="admin_ui_input_autoComplete_selectBox"></div>');
        }
        var selectBox = $input.siblings(".admin_ui_input_autoComplete_selectBox");
        $input.bind('input',function(){
            var keyword = $.trim($input.val());
            var timeout;
            if(keyword!=""){
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








