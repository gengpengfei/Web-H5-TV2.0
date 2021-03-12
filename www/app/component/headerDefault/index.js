define(['jquery', 'navigation', 'text!component/headerDefault/index.html', 'css!component/headerDefault/index.css'], function($, SpatialNavigation, view) {
    var SN = SpatialNavigation;

    function initHtml() {
        $("#header_container").html(view);
    }

    function initFocus() {
        // 头部
        SN.add({
            id: 'header',
            selector: '#header .focusable',
            enterTo: 'last-focused',
        });
        SN.makeFocusable();
        SN.disable('header');
    }

    function initEvent() {
        //-- enter 事件
        $('#header .focusable')
            .off('sn:enter-down')
            .on('sn:enter-down', function() {
                $(this).addClass('active');
            })
            .off('sn:enter-up')
            .on('sn:enter-up', function() {
                var $this = $(this);
                $this.removeClass('active');
                //-- 对接底层接口
            })
            .off('sn:willunfocus')
            .on('sn:willunfocus', function(e) {
                //-- 按键方向
                var direction = e.originalEvent.detail.direction;
                if (direction == 'down') {
                    SN.disable('header');
                }
            })
            .off('sn:enter-click')
            .on('sn:enter-click', function() {
                var $this = $(this);
                $this.removeClass('active');
                //-- 对接底层接口
            })
    }

    function init() {
        initHtml();
        initFocus();
        initEvent();
    }

    return { init: init }
})