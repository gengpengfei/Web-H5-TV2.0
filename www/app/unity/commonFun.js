define(['unity/historyRouter'], function(Router) {
    'use strict';
    //-- 设置Date格式化函数
    Date.prototype.format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    function maxzIndex() {
        var modules = document.querySelectorAll("[module]");
        var arr = new Array();
        for (var i = 0; i < modules.length; i++) {
            var zIndex = modules[i].style.zIndex || 0;
            if (zIndex == 'auto') zIndex = 0
            arr.push(zIndex);
        }
        return parseInt(Math.max.apply(null, arr)) || 0;
    }

    function isURL(domain) {
        var name = /^((https|http){0,1}(:\/\/){0,1})(www\.){0,1}(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])*/;
        if (!(name.test(domain))) return false;
        return true;
    }

    //-- 获取图片对应的大小
    function optImage(baseUrl, imgInfo) {
        var bodyWidth = document.body.scrollHeight;
        if (!imgInfo) {
            return { img: '', bg_img: '' };
        }
        imgInfo = JSON.parse(imgInfo);
        var imgs = {}
        if (bodyWidth >= 2160) {
            if (imgInfo['img']) {
                imgs['img'] = baseUrl + 'big/' + imgInfo['img'];
            }
            if (imgInfo['bg_img']) {
                imgs['bg_img'] = baseUrl + 'big/' + imgInfo['bg_img'];
            }
        } else if (bodyWidth >= 1080 && bodyWidth < 2160) {
            if (imgInfo['img']) {
                imgs['img'] = baseUrl + 'big/' + imgInfo['img'];
            }
            if (imgInfo['bg_img']) {
                imgs['bg_img'] = baseUrl + 'big/' + imgInfo['bg_img'];
            }
        } else {
            if (imgInfo['img']) {
                imgs['img'] = baseUrl + 'big/' + imgInfo['img'];
            }
            if (imgInfo['bg_img']) {
                imgs['bg_img'] = baseUrl + 'big/' + imgInfo['bg_img'];
            }
        }
        return imgs;
    }

    //-- 替换游戏的模式
    function updataGameModel(model) {
        var href = window.location.href;
        if (window.jsUtil) {
            try {
                jsUtil.setGameMode(parseInt(model))
            } catch (e) {
                console.log('老板本报错');
            }

            try {
                jsUtil.setGameMode(href, parseInt(model))
            } catch (e) {
                console.log('新板本报错');
            }

        }
        if (window.sraf && window.sraf.tabs && window.sraf.tabs.setOBUrlMode) {
            window.sraf.tabs.setOBUrlMode(href, parseInt(model))
        }
    }

    //-- 根据当前对象替换游戏模式
    function updataGameModelByElem($this) {
        //-- 对接底层接口
        var model = $this.attr("model");
        //-- 更新游戏模式
        if (model) {
            updataGameModel(model)
        }
    }

    //-- 在游戏模块路由间跳转，依然需要调用模式切换 （谨记）
    function updataFocusModelByElem() {
        updataGameModel(5);
    }

    //-- 设置默认的推荐内容
    function setContentDefault() {
        return {
            type: 'default',
            img_info: {
                '720P': {
                    // img: "/app/static/image/content-default.webp"
                },
                '1080P': {
                    // img: "/app/static/image/content-default.webp"
                },
                '2K': {
                    // img: "/app/static/image/content-default.webp"
                }
            }
        }
    }

    var userActivityInterval = 0;

    function userActivityEvent() {
        var init = 0;
        var callbackFun;
        var checkTime = function() {
            init += 1;
            if (init == 4) {
                console.log(111, userActivityInterval);
                clearInterval(userActivityInterval);
                removeEvent();
                callbackFun && callbackFun()
            }
        }
        var eventFun = function() {
            init = 0;
        }
        var addEvent = function(callback) {
            callbackFun = callback;
            userActivityInterval = setInterval(checkTime, 1000);
            var dom = document.getElementById("play_video");
            dom.addEventListener("click", eventFun);
            dom.addEventListener("keydown", eventFun);
            dom.addEventListener("mousemove", eventFun);
            dom.addEventListener("mousewheel", eventFun);
        }
        var removeEvent = function() {
            clearInterval(userActivityInterval);
            var dom = document.getElementById("play_video");
            dom.removeEventListener("click", eventFun);
            dom.removeEventListener("keydown", eventFun);
            dom.removeEventListener("mousemove", eventFun);
            dom.removeEventListener("mousewheel", eventFun);
        }
        return { addEvent: addEvent, removeEvent: removeEvent }
    }

    //-- 内容跳转逻辑判断
    function contentJump($this) {
        var direction = $this.attr('direction');
        var videoId = $this.attr('videoId');
        //-- 更新模式
        updataGameModelByElem($this);
        if (direction == 2) {
            Router.locationHref($this);
            return;
        } else if (direction == 1) {
            //-- 跳转播放页
            Router.push('/play/' + videoId);
        }
    }

    function scrollPageAnimation(param) {
        if (param == true) {
            //-- 整体移动页面到顶端，显示page
            $("#video_recommend").addClass("scrollAnimation");
            //-- 显示提示icon图标
            $(".video-channel-icon").addClass("active-show");
        } else {
            //-- 隐藏page
            $("#video_recommend").removeClass("scrollAnimation");
            //-- 隐藏提示icon图标
            $(".video-channel-icon").removeClass("active-show");
        }
    }
    return {
        maxzIndex: maxzIndex,
        isURL: isURL,
        optImage: optImage,
        updataGameModelByElem: updataGameModelByElem,
        updataFocusModelByElem: updataFocusModelByElem,
        updataGameModel: updataGameModel,
        setContentDefault: setContentDefault,
        userActivityEvent: userActivityEvent,
        scrollPageAnimation: scrollPageAnimation,
        contentJump: contentJump
    }
});