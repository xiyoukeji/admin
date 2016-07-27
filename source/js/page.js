function TablePage(id,size){  
   var $table = $(id);  
    var currentPage = 0;  //当前页  
    var pageSize = size;  //每页行数（不包括表头）  
    $table.bind("repaginate", function()  
    {  
       //console.log($table.find("tbody tr").eq(0));  
      $table.find("tbody tr").hide().slice(currentPage * pageSize, (currentPage + 1) * pageSize).show();  
     // $table.find("tbody tr").eq(0).show();  
    });  
    var numRows = $table.find("tbody tr").length;  //记录宗条数  
    var numPages = Math.ceil(numRows/pageSize);    //总页数  
    //console.log(numPages);  
    var $pager = $("<div class='page'><a href='javascript:void(0)'><span id='Prev' style='margin-right:4px;'>« Prev</span></a></div>");  //分页div  
    for( var page = 0; page < numPages; page++ )  
    {  
  
      //为分页标签加上链接  
      $("<a href='javascript:void(0)'><span id='"+(page+1)+"'>"+ (page+1) +"</span></a>")  
           .bind("click", { "newPage": page }, function(event){  
                currentPage = event.data["newPage"];  
                //console.log($(this).children("span"));  
                $(this).children("span").attr("class","click_page");  
                $(this).children("span").css({"color":"#FFFFFF"});  
                $(".page a span").not($(this).children("span")).attr("class","");  
                $(".page a span").not($(this).children("span")).css({"color":"#000"});
                $table.trigger("repaginate");  
            })  
            .appendTo($pager);  
  
        $pager.append("  ");  
    }  
    //$table.trigger("repaginate");  
    var next=$("<a href='javascript:void(0)'><span id='Next'>Next »</span></a>");  
    $pager.append(next);  
    $pager.appendTo(".admin_ui_pagination");//分页div插入table  
    $("#1").attr("class","click_page");  
    $("#1").css({"color":"#FFFFFF"});  
    $table.trigger("repaginate");  
    //console.log($("#1"));  
    //$("#1").attr("class","click_page");  
    //$("#1").css({"background":"#FFFFFF"});  
    $("#Prev").bind("click",function(){  
       var prev=Number($(".click_page").text())-2;  
       currentPage=prev;  
       // $(this).css({"background":"#000000"});  
       if(currentPage<0) {  
         // $(this).css({"background":"#c0c0c0"});  
         return;  
 }  
       $("#"+(prev+1)).attr("class","click_page");  
       $("#"+(prev+1)).css({"color":"#000"});  
       $(".page a span").not($("#"+(prev+1))).attr("class","");  
       $(".page a span").not($("#"+(prev+1))).css({"color":"#000"});  
       //console.log(currentPage);  
       $table.trigger("repaginate");  
    });  
     $("#Next").bind("click",function(){  
       var next=$(".click_page").attr("id");  
       currentPage=Number(next);  
       //console.log($(".click_page").text());  
       $(this).css({"background":"#FFFFFF"});  
       if((currentPage+1)>numPages) {  
         // $(this).css({"background":"#c0c0c0"});  
         return;  
         }  
       $("#"+(currentPage+1)).attr("class","click_page");  
       $("#"+(currentPage+1)).css({"color":"#FFFFFF"});  
       $(".page a span").not($("#"+(currentPage+1))).attr("class","");  
       $(".page a span").not($("#"+(currentPage+1))).css({"color":"#000"});  
       $table.trigger("repaginate");  
    });  
      
 }