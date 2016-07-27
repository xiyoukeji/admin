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
    // $(contentSelector+" .leftmenu>div").bind('mouse',function(){

    // });
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
        
    });
}








