define([
    'jquery', 'navigation', 'unity/commonFun', 'unity/historyRouter', 'text!./index.html', 'css!./index.css'
], function($, SpatialNavigation, fun, Router, view) {
    var SN = SpatialNavigation;

    function initHtml(container) {
        $("#" + container).html(view);
    }

    //-- 加载子组件
    function initData() {
        //-- 加载 videos 分类列表模块
        require(['component/videoComponent/RecommendListDefault/index'], function(module) {
            try {
                module.init({
                    container: "recommend_container_1"
                })
            } catch (e) {
                console.log(e);
            }
        })
    }

    function initFocus() {
        // 头部
        SN.add({
            id: 'video_channel_list',
            selector: '#video_channel_list .focusable',
            straightOnly: true,
            restrict: 'self-first',
            leaveFor: {
                left: "#video"
            }
        });
        SN.makeFocusable();
    }

    function initEvent() {
        //-- enter 事件
        $('#video_channel_list .focusable')
            .off('sn:enter-down')
            .on('sn:enter-down', function() {
                $(this).addClass('active');
            })
            .off('sn:enter-up')
            .on('sn:enter-up', function() {
                var $this = $(this);
                $this.removeClass('active');
                var category = $this.attr("category");
                Router.push('/category/' + category);
            })
            .off('sn:enter-click')
            .on('sn:enter-click', function() {
                var $this = $(this);
                $this.removeClass('active');
                var category = $this.attr("category");
                Router.push('/category/' + category);
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                var detail = e.originalEvent.detail;
                if (detail.direction == 'left' || detail.direction == 'right') {
                    SN.focus(this);
                } else if (detail.direction != undefined) {
                    //-- 整体移动页面到顶端动画
                    fun.scrollPageAnimation(true);
                    setTimeout(function() {
                        SN.disable('video_banner');
                        SN.focus(this);
                    }, 300)
                }
            })
            .off('sn:navigatefailed')
            .on('sn:navigatefailed', function(e) {
                //-- 按键方向
                var direction = e.originalEvent.detail.direction;
                if (direction == 'up') {
                    //-- 整体移动页面到底部动画
                    fun.scrollPageAnimation(false);
                    setTimeout(function() {
                        SN.enable('video_banner');
                        SN.focus('@video_banner');
                    }, 300)
                }
            })
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