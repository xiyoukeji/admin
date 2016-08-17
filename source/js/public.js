var ADMIN_CONFIG = {
    "homePage": "welcome.html",
    "mainBodySelector": "#admin_body",
    "headerSelector": "#admin_header",
    "contentSelector": "#admin_content",
    "leftSelector": "#admin_left"
};
$(function() {
    adminInit();
    function adminInit(){
        eventBind();
    }
});

function eventBind() {
    // eventBind 仅进行一次
    // 页面刷新 hash变化时的处理
    $(window).bind('load hashchange', loadContent);
    $(window).bind('resize', windowReset);
    $(window).bind('click', function() {
        $("[data-hideWhenBlur]").hide();
    });
    $(window).on('click', '[data-urlBack]', function() {
        window.history.back();
    })
    $(ADMIN_CONFIG.headerSelector+" .client").bind("click",function(e){
        if($("#admin_ui_dropdown_menu").is(":hidden")){
            $("#admin_ui_dropdown_menu").show();
        }
        else{
            $("#admin_ui_dropdown_menu").hide();
        }
        e.stopPropagation();
    });
    $(ADMIN_CONFIG.leftSelector+" .leftmenu>div>.line").bind('click',function(){
        if($(this).next('.submenu').length){
            // 有子菜单
            if($(this).parent().hasClass("active")){
                // 打开的
                $(this).next('.submenu').slideUp(300);
                $(this).parent().removeClass("active");
            }
            else{
                $(this).next('.submenu').slideDown(300);
                $(this).parent().addClass("active");
            }
            
        }
    });
}
function uiComponentEventBind(){
    $(".uploadPic").off().on('change', function(event) {
        event.preventDefault();
        var parent = $(this).parents(".admin_ui_imgUpload");
        var multiFlag = false;
        if (!($(this).attr("multiple") == undefined)) {
            multiFlag = true;
        }
        for (var i = 0; i < $(this)[0].files.length; i++) {
            var file = $(this)[0].files[i];
            if (file.size > 2097152) {
                alert("上传图片请小于2M");
                return false;
            }
            if (!/image\/\w+/.test(file.type)) {
                alert("文件必须为图片！");
                return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                createCanvas(this.result, multiFlag, parent);
            }
        }
    });
    // 自动填充输入框 开始
    $.each($("[data-autoComplete]"), function() {
        var $this = $(this);
        var $input = $(this).children('input');
        var params = $this.attr('data-params');
        var regx = /<js>(.*?)<\/js>/g;

        if (!$input.siblings('.admin_ui_input_autoComplete_selectBox').length) {
            $input.after('<div class="admin_ui_input_autoComplete_selectBox" data-hideWhenBlur></div>');
        }
        var selectBox = $input.siblings(".admin_ui_input_autoComplete_selectBox");
        var timeout;
        $input.bind('input', function() {
            var keyword = $.trim($input.val());
            if (keyword != "") {
                var _params = params;
                do {
                    var matchArr = regx.exec(params);
                    matchArr && (_params = _params.replace(/<js>.*?<\/js>/, eval(matchArr[1])));
                } while (regx.lastIndex);
                _params = JSON.parse(_params);
                timeout && clearTimeout(timeout);
                timeout = setTimeout(function() {
                    selectBox.empty().hide();
                    $.ajax(_params).done(function(data) {
                        if (data.state == 0) {
                            var textArr = data.data;
                            if (textArr.length > 0) {
                                for (var i = 0, length = textArr.length; i < length; i++) {
                                    var line = $('<div class="line">' +
                                        textArr[i] +
                                        '</div>');
                                    line.bind('click', function() {
                                        if (!$this.siblings('.admin_ui_input_tagBox').length) {
                                            $this.before('<div class="admin_ui_input_tagBox"></div>');
                                            $this.siblings('.admin_ui_input_tagBox').on('click', '.admin_ui_colorLabel', function() {
                                                $(this).remove();
                                            });
                                        }
                                        var tagBox = $this.siblings('.admin_ui_input_tagBox');
                                        var length = length = tagBox.children('.admin_ui_colorLabel').length;
                                        if (length) {
                                            for (var k = 0; k < length; k++) {
                                                if (tagBox.children('.admin_ui_colorLabel').eq(k).text() == $(this).text()) {
                                                    break;
                                                }
                                                if (k == length - 1) {
                                                    tagBox.append('<div class="admin_ui_colorLabel">' + $(this).text() + '</div>');
                                                }
                                            }
                                        } else {
                                            tagBox.append('<div class="admin_ui_colorLabel">' + $(this).text() + '</div>');
                                        }
                                    });
                                    selectBox.append(line);
                                }
                                selectBox.show();
                            } else {
                                var line = '<div class="line" onclick="return false">' +
                                    '无搜索结果' +
                                    '</div>';
                                selectBox.append(line);
                            }
                        }
                    }).fail(function(data) {
                        console.log(data);
                    });
                }, 500);
            } else {
                selectBox.empty().hide();
            }
        })
    });
    // 自动填充输入框 结束
    // 上传轮播图部分 开始
    $.each($("[data-sildeImageBox]"),function(){
        var $this = $(this);
        var src = $this.attr("data-src");
        if(src){
            var image = '<img src="'+src+'" />';
            $this.find(".slideImageUpload").append(image);
        }
        $this.find(".slideImageUpload").bind('click',function(){
            var $slideImageUpload = $(this);
            var $sildeImageBox = $this;
            // 值为0时说明这个为传图片的盒子
            if($(this).closest("[data-sildeImageBox]").attr("data-sildeImageBox")!=1){
                var fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.click();
                fileInput.addEventListener('change',function(event){
                    if(this.files[0].type.match(/image\/\w*/)){
                        var objectURL = window.URL.createObjectURL(this.files[0]);
                        var _image = '<img src="'+objectURL+'" />';
                        var $_sildeImageBox = $sildeImageBox.clone().attr({
                            "data-src": objectURL,
                            "data-sildeImageBox": 1
                        });
                        $_sildeImageBox.find(".slideImageUpload").append(_image);
                        $_sildeImageBox.insertBefore($this);
                    }
                    else{
                        alert("请上传图片格式的文件");
                    }
                    
                });
            }
        });
    });
    $(".admin_ui_cont").on('click','.deleteButton',function(){
        var $deleteButton = $(this);
        $deleteButton.closest(".amin_ui_slideImageBox").remove();
    });
    // 上传轮播图部分 结束
}
function windowReset(){
    var h =  $(window).height()-$(ADMIN_CONFIG.headerSelector).height();
}

function createCanvas(src, flag, parent) {
    var canvas = document.getElementById("uploadImg");
    var cxt = canvas.getContext('2d');
    // canvas.width = 640;
    // canvas.height = 400;
    var img = new Image();
    img.src = src;
    img.onload = function() {
        var w = img.width;
        var h = img.height;
        canvas.width = w;
        canvas.height = h;
        // cxt.drawImage(img, 0, 0,640,400);
        cxt.drawImage(img, 0, 0);
        var blob = dataURLtoBlob(canvas.toDataURL("image/jpeg", 0.9));
        if (flag == true) {
            parent.find(".multiPicBox").append("<img id='img" + $("img").length + "' src='" + canvas.toDataURL("image/jpeg", 0.9) + "'>")
        } else {
            parent.find(".showPic").show().attr('src', canvas.toDataURL("image/jpeg", 0.9));
        }
        $.ajax({
            url: "/front/uploadByUserBase64.do",
            type: "POST",
            data: {
                "imgStr": canvas.toDataURL("image/jpeg", 0.9).split(',')[1]
            },
            success: function(data) {
                console.log(data);
                if (flag == true) {
                    parent.find("#img" + ($("img").length - 1)).attr('data-url', "/" + data.url);
                } else {
                    parent.find(".showPic").show().attr('data-url', "/" + data.url);
                }
            }
        });
    }
}

function uploadPic(area) {
    var dtd = $.Deferred();
    var area = area;
    if (!area) {
        area = "body";
    }
    // 取得编辑器外图片
    var $imglist = $(area).find('img');
    var $editorImg = $(getEditorContent()).find("img")
    var imgLength = $imglist.length + $editorImg.length;
    var count = 0;
    $imglist.each(function(index, el) {
        $.post('/front/uploadByUserBase64.do', { "imgStr": $(this).attr('src') }, function(data, textStatus, xhr) {
            count++;
        });
    });
    $editorImg.each(function(index, el) {
        $.post('/front/uploadByUserBase64.do', { "imgStr": $(this).attr('src') }, function(data, textStatus, xhr) {
            count++;
        });
    });
}
// 获得编辑器中内容
function getEditorContent() {
    return editor.getContent();
}
// 设置编辑器内容
function setEditorContent(html) {
    editor.setContent(html);
}
// 往编辑器中插入内容
function insertContentToEditor(html) {
    editor.insertContent(html);
}
// 设置 "design", "code" or "readonly"
function setEditorMode(mode) {
    editor.setMode(mode);
}
// base64转blob
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function windowReset() {
    var h = $(window).height() - $(ADMIN_CONFIG.headerSelector).height();
    $(ADMIN_CONFIG.contentSelector).height(h);
}

function loadContent() {
    var hash = window.location.hash;
    if (hash == "") {
        hash = "#/" + ADMIN_CONFIG.homePage;
    }
    $(ADMIN_CONFIG.contentSelector).load(hash.split("/")[1], function() {
        uiComponentEventBind();
    });
}
