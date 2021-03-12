define(['jquery', 'navigation', 'unity/data', 'unity/commonFun', 'unity/historyRouter', 'text!./index.html', 'css!./index.css'], function($, SpatialNavigation, dataFun, fun, Router, view) {
    var SN = SpatialNavigation;

    function initHtml(container) {
        $("#" + container).html(view);
    }

    function initData() {
        dataFun.getVideoBanners().then(function(res) {
                var data = res.list;
                var $items = $("#video_banner_list .focusable");
                var $bgItems = $("#video_banner_bg_list img");
                var $bannertitles = $("#video_banner_bg_list .videobanner-title");
                var $bannerDirection = $("#video_banner_bg_list .videobanner-direction");
                for (var i = 0; i < 4; i++) {
                    var $item = $($items[i]);
                    var itemData = data[i];
                    var html = '';
                    if (!itemData) itemData = fun.setContentDefault();
                    $item.attr("leaveUrl", itemData.url);
                    $item.attr("model", itemData.model);
                    $item.attr("type", itemData.type);
                    $item.attr("direction", itemData.direction);
                    $item.attr("isSeries", itemData.is_series);
                    $item.attr("mediaId", itemData.id);

                    var imgs = fun.optImage(itemData['base_url'], itemData['16_9']);
                    $item.attr("imgUrl", imgs['img']);

                    if (imgs['bg_img']) html += '<img class="item-img" src="' + imgs['bg_img'] + '" onerror="this.style.display=\'none\'" />'
                    if (imgs['img']) html += '<img class="item-img" src="' + imgs['img'] + '" onerror="this.style.display=\'none\'" />';
                    $item.html(html);

                    //-- 插入背景图片 及 说明
                    $($bgItems[i]).attr("src", imgs['img']);
                    $($bannertitles[i]).text(itemData.name);
                    $($bannerDirection[i]).text(itemData.description);
                }
            })
            .catch(function(e) {
                console.log(e);
            })
    }

    function initFocus() {
        // 头部
        SN.add({
            id: 'video_banner',
            selector: '#video_banner .focusable',
            straightOnly: true,
            restrict: 'self-first',
            leaveFor: {
                left: "#video"
            }
        });
        SN.makeFocusable();
        SN.focus('@video_banner');
    }

    function initEvent() {
        //-- enter 事件
        $('#video_banner .focusable')
            .off('sn:enter-down')
            .on('sn:enter-down', function() {
                $(this).addClass('active');
            })
            .off('sn:enter-up')
            .on('sn:enter-up', function() {
                var $this = $(this);
                var mediaId = $this.attr('mediaId');
                $this.removeClass('active');
                //-- 更新模式
                fun.updataGameModelByElem($this);
                //-- 跳转到列表页
                Router.push('/watch/' + mediaId);
            })
            .off('sn:enter-click')
            .on('sn:enter-click', function(e) {
                var $this = $(this);
                $this.removeClass('active');
                var mediaId = $this.attr('mediaId');
                //-- 更新模式
                fun.updataGameModelByElem($this);
                //-- 跳转到列表页
                Router.push('/watch/' + mediaId);
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                SN.pause();
                bannerAnimation($(this), function() {
                    SN.focus(this);
                    SN.resume();
                });
            })
            .off('sn:navigatefailed')
            .on('sn:navigatefailed', function(e) {
                //-- 按键方向
                var direction = e.originalEvent.detail.direction;
                if (direction == 'up') {
                    SN.enable('header');
                    SN.focus('header');
                }
            })
    }

    //-- banner 动画切换
    function bannerAnimation($item, callback) {
        $bgDom = $("#video_banner #video_banner_bg_img");
        var index = $item.index();
        $("#video_banner_bg_list .videobanner-item").removeClass("activity");
        $("#video_banner_bg_list .videobanner-item:nth(" + index + ")").addClass("activity");
        callback.call($item);
    }

    function init(config) {
        var container = config.container
        initHtml(container);
        initData();
        initEvent();
        initFocus();
    }
    return {
        init: init
    };
})