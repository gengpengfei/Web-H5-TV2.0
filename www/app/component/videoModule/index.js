define(['jquery', 'navigation', 'unity/data', 'unity/commonFun', 'unity/historyRouter', 'text!component/videoModule/index.html', 'css!component/videoModule/index.css'], function($, SN, dataFun, fun, Router, view) {
    'use strict';

    function initHtml() {
        $("#container").append(view);
        //-- 添加路由标识 用于 historyRouter 方法 pageAnimation 切换页面显示(优化项，暂时没用到)
        var path = location.pathname;
        var module = path.split('/')[1];
        $("#video_module").attr('Router', module);
    }

    function initData() {
        var req = Router.params();
        var params = req.params
        if (!params.id) return;
        dataFun.getCategoryVideos({ categoryId: params.id }).then(function(res) {
                var data = res.list;
                if (data.length == 0) return;
                var data = data[0];
                //-- 添加分类title
                var category_name = data.category_name ? data.category_name : 'category';
                $("#video_module .video-module-title").html(category_name);
                var videoList = data.video;
                var length = videoList.length;
                if (length < 8) {
                    //-- 移除多余的空白格
                    $("#video_module .video-module-container .content-item:gt(" + (length - 1) + ")").remove()
                };

                //-- 取余补充数据
                var _y = length % 4;
                for (var j = 0; j < 4 - _y; j++) {
                    //-- 由于布局使用flex ， 如果一行不足5个，需要用空白div填充
                    var defaultNull = {
                        img_info: null,
                        model: 0,
                        type: 'null',
                        url: "",
                    }
                    videoList.push(defaultNull)
                }
                var $videoTtem = $("#video_module .focusable");
                for (var i = 0; i < videoList.length; i++) {
                    var itemData = videoList[i];
                    var $item = $($videoTtem[i]);
                    var html = ''
                    if ($item.length == 0) {
                        //-- 如果是填充数据，不能获取焦点
                        if (itemData.type == 'null') {
                            var $itemContainer = $('<div class="content-item MARGIN-BUTTOM WIDTH-5"><div class="row-center"></div></div>');
                        } else {
                            var $itemContainer = $('<div class="content-item MARGIN-BUTTOM WIDTH-5"><div class="content-common  focusable row-center"></div></div>');
                        }
                        $("#video_module .video-module-container").append($itemContainer)
                        $item = $itemContainer.children().first();
                    }
                    $item.attr("leaveUrl", itemData.url);
                    $item.attr("model", itemData.model);
                    $item.attr("type", itemData.type);
                    $item.attr("mediaId", itemData.media_id);

                    var imgs = fun.optImage(itemData['base_url'], itemData['16_9']);
                    if (imgs['bg_img']) html += '<img class="item-img" src="' + imgs['bg_img'] + '" onerror="this.style.display=\'none\'" />'
                    if (imgs['img']) html += '<img class="item-img" src="' + imgs['img'] + '" onerror="this.style.display=\'none\'" />';
                    $item.html(html);

                }
            }).then(function() {
                //-- 初始化焦点
                initFocus();
                initEvent();
            })
            .catch(function(e) {
                console.log(e);
            })
    }

    function initFocus() {
        // 头部
        SN.add({
            id: 'video_module',
            selector: '#video_module .focusable',
            restrict: 'self-first',
        });
        SN.makeFocusable();
        $("body").css({ filter: 'none' });
    }

    function initEvent() {
        //-- enter 事件
        $('#video_module .focusable')
            .off('sn:enter-down')
            .on('sn:enter-down', function() {
                $(this).addClass('active');
            })
            .off('sn:enter-up')
            .on('sn:enter-up', function() {
                var $this = $(this);
                $this.removeClass('active');
                //-- 更新模式
                fun.updataGameModelByElem($this);
                var mediaId = $this.attr('mediaId');
                //-- 跳转到列表页
                Router.push('/watch/' + mediaId);
            })
            .off('sn:enter-click')
            .on('sn:enter-click', function() {
                var $this = $(this);
                $this.removeClass('active');
                //-- 更新模式
                fun.updataGameModelByElem($this);
                var mediaId = $this.attr('mediaId');
                //-- 跳转到列表页
                Router.push('/watch/' + mediaId);
            })
            .off('sn:enter-back')
            .on('sn:enter-back', function() {
                Router.back();
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                var detail = e.originalEvent.detail;
                if (detail.direction == 'left' || detail.direction == 'right') {
                    SN.focus(this);
                } else {
                    var _elem = $('#video_module')
                    SN.pause();
                    $(this).ensureVertical(_elem, function() {
                        SN.focus(this);
                        SN.resume();
                    });
                }
            })
    }

    //-- 控制当前页面的焦点
    function checkFocus() {
        var params = Router.params();
        var lastUid = Router.getRouteLastFocus();
        var $lastFocus = $("[_uid='" + lastUid + "']");
        if ($lastFocus.length > 0 && (params.type == 'systemBack' || params.type == 'externalBack')) {
            SN.focus($lastFocus);
        } else {
            SN.focus('#video_module .focusable');
        }
    }

    function init() {
        $("body").css({ filter: 'blur(0.3vw)' });
        initHtml();
        initData();
        initFocus();
        initEvent();
    }

    return { init: init, checkFocus: checkFocus }
})