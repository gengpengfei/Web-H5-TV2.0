define(['jquery', 'navigation', 'unity/commonFun', 'text!./index.html', 'css!./index.css'], function($, SpatialNavigation, fun, view) {
    var SN = SpatialNavigation;
    var mediaObj;

    function initHtml(container) {
        $("#" + container).html(view);
    }

    function initFocus() {
        // 头部
        SN.add({
            id: 'media_component_list',
            selector: '#media_component_list .focusable',
            straightOnly: true,
            restrict: 'self-only',
            disabled: true
        });
        SN.makeFocusable();
    }

    function initEvent() {
        //-- enter 事件
        $('#media_component_list .focusable')
            .off('sn:enter-down')
            .on('sn:enter-down', function() {
                $(this).addClass('active');
            })
            .off('sn:enter-up')
            .on('sn:enter-up', function() {
                var $this = $(this);
                var key = $this.attr('key');
                //-- 设置倍速播放
                if (key == 'rate') {
                    var value = $this.attr('value');
                    mediaObj.mediaPlayer.playbackRate(parseFloat(value));
                    hidden();
                }
            })
            .off('sn:enter-click')
            .on('sn:enter-click', function() {
                var $this = $(this);
                var key = $this.attr('key');
                //-- 设置倍速播放
                if (key == 'rate') {
                    var value = $this.attr('value');
                    mediaObj.mediaPlayer.playbackRate(parseFloat(value));
                    hidden();
                }
            })
            .off('sn:enter-back')
            .on('sn:enter-back', function() {
                hidden();
                return false;
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                SN.pause();
                var _elem = $('#media_component_list');
                $(this).ensureVerticalByTopAndBottom(_elem, function() {
                    SN.focus(this);
                    SN.resume();
                }, 10, 10);
            })
            .off('mouseover')
            .on('mouseover', function(e) {
                e.stopPropagation();
                var $target = $(e.target);
                if ($target.hasClass("focusable")) SN.focus($target)
            })
    }

    function hidden() {
        //-- 隐藏视频详情层
        $("#media_component_container").addClass('container-hidden');
        SN.disable('media_component_list');
        //-- 设置焦点到播放器
        mediaObj.setFocus();

        fun.userActivityEvent().removeEvent();
    }

    function show() {
        //-- 显示选集&推荐
        $("#media_component_container").removeClass('container-hidden');
        SN.enable('media_component_list');
        //-- 获取当前播放速率
        var playRate = mediaObj.mediaPlayer.playbackRate();
        $("#play_rate .focusable").removeClass('current').filter('[value="' + playRate + '"]').addClass('current');
        SN.focus($('#media_component_list .focusable[value="' + playRate + '"]'));
        //-- 初始化用户活动状态  userActivityEvent
        fun.userActivityEvent().addEvent(hidden);
    }

    function init(config) {
        var container = config.container
        mediaObj = config.mediaObj;
        initHtml(container);
        initEvent();
        initFocus();
    }
    return {
        init: init,
        show: show
    };
})