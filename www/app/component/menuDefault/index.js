define([
    'jquery', 'navigation', 'unity/historyRouter', 'unity/commonFun', 'unity/data', 'text!component/menuDefault/index.html', 'css!component/menuDefault/index.css'
], function($, SpatialNavigation, Router, fun, dataFun, view) {
    var SN = SpatialNavigation;

    function setMenuLocal(id) {
        sessionStorage.setItem('menu', id)
    }

    //-- 判断模块显示和隐藏
    function checkModule(id) {
        $('#contents_container')
            .children()
            .addClass('hidden')
            .filter('#' + id)
            .removeClass('hidden');

        //-- 每次切换将模块的滚动重置为0
        var $now = $("#contents_container .page-container[class!='hidden']");
        $now.find('.' + id + 'pageScroll').css("transform", "translateX(0px) translateZ(0)");
    }

    function initHtml() {
        $("#menu_container").html(view);
    }

    function initData() {
        dataFun.getMenuList().then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    var itemData = data[i];
                    if (itemData.status == 1) {
                        var $item;
                        switch (itemData.name) {
                            case 'recommend':
                                $item = $('<div id="recommend" class="menu-recommend focusable row-center"><img src="app/component/menuDefault/image/recommend-icon.webp" /></div>');
                                break;
                            case 'video':
                                $item = $('<div id="video" class="menu-video focusable row-center"><img src="app/component/menuDefault/image/video-icon.webp" /></div>');
                                break;
                            case 'video':
                                $item = $('<div id="video" class="menu-video focusable row-center"><img src="app/component/menuDefault/image/video-icon.webp" /></div>');
                                break;
                            case 'app':
                                $item = $('<div id="app" class="menu-app focusable row-center"><img src="app/component/menuDefault/image/app-icon.webp" /></div>');
                                break;
                            case 'music':
                                $item = $('<div id="music" class="menu-music focusable row-center"><img src="app/component/menuDefault/image/music-icon.webp" /></div>');
                                break;
                        }
                        $("#menu .menu-content").append($item);
                    }
                }
                //-- 设置键盘导航
                $first = $("#menu .focusable:first-child");
                $last = $("#menu .focusable:last-child");
                $first.attr('data-sn-up', '#' + $last.attr('id'))
                $last.attr('data-sn-down', '#' + $first.attr('id'))

                var req = Router.params();
                var _menu_id = sessionStorage.getItem('menu');
                //-- 设置焦点是公共事件 ，menu渲染有可能在设置焦点之后，此处先单独设置半焦点状
                if (_menu_id && (req.type == 'externalBack' || req.type == 'systemBack')) {
                    $("#" + _menu_id).addClass('current');
                } else {
                    _menu_id = 'recommend';
                    $("#" + _menu_id).addClass('current');
                }
            }).then(function() {
                initFocus();
                initEvent();
            })
            .catch(function(e) {
                console.log(e);
                //-- 移除当前模块
                remove();
            })
    }

    function initFocus() {
        // 头部
        SN.add({
            id: 'menu',
            selector: '#menu .focusable',
            enterTo: "last-focused"
        });
        SN.makeFocusable();
    }

    function initEvent() {
        //-- enter 事件
        $('#menu .focusable')
            .on('sn:enter-down', function() {
                $(this).addClass('active');
            })
            .on('sn:enter-up', function() {
                var $this = $(this);
                $this.removeClass('active');
            })

        //-- 导航栏切换
        $('#menu .focusable')
            .off('sn:willunfocus')
            .on('sn:willunfocus', function(e) {
                //-- 添加半选中状态
                $(this).addClass('current');
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                setMenuLocal(this.id)
                var direction = e.originalEvent.detail.direction;
                //-- 移除半选中状态
                $("#menu .focusable").removeClass("current");
                if (direction != 'right' || direction != 'left') {
                    checkModule(this.id + '_container');
                }
                SN.pause();
                setTimeout(function() {
                    SN.focus(this);
                    SN.resume();
                }.bind(this))
                return true;
            })
    }

    function init() {
        initHtml();
        initData();
        initFocus();
        initEvent();
    }
    return { init: init }
})