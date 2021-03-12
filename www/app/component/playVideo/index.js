define(['jquery', 'navigation', 'unity/data', 'unity/commonFun', 'unity/historyRouter', 'plugin/media/index', 'text!./index.html', 'css!./index.css'], function($, SN, dataFun, fun, Router, Media, view) {
    'use strict';
    //-- 选集间隔 （8集一个间隔）
    var space = 8;
    var selectMoveStatus = false;

    function initHtml() {
        $("#container").append(view);

        //-- 添加路由标识 用于 historyRouter 方法 pageAnimation 切换页面显示(优化项，暂时没用到)
        var path = location.pathname;
        var module = path.split('/')[1];
        $("#play_video").attr('Router', module)
    }

    function initMedia(defaultData) {
        // var defaultData = { "url": "/app/plugin/media/test/PexelsVideos.mp4", "name": "Keanu Reeves", "img": "/app/component/videoComponent/BannerDefault/image/1.jpg" }
        Media.init({
            container: 'media_container',
            mediaInfo: defaultData,
            autoPlay: true,
            callback: {
                down: function() {
                    // //-- 显示选集&推荐
                    // $("#play_container").removeClass('container-hidden');
                    // //-- 切换当前视频详情状态
                    // window.is_play_status = "true";
                    // if ($("#play_opt_list .focusable").length > 0) {
                    //     SN.focus("@play_opt_list");
                    // } else {
                    //     SN.focus("@video_recommend");
                    // }
                    // fun.userActivityEvent().addEvent(hiddenOpt);
                },
                back: function() {
                    routerBack();
                }
            }
        })

        //--初始化播放器的焦点
        Media.setFocus();
    }

    function initData() {
        var req = Router.params();
        var params = req.params;

        dataFun.getVideoInfoById({ videoId: params.id }).then(function(res) {
                var data = res.materialList[0];
                // //-- 填充选集s
                // var optList = data.plays;
                // var optLength = optList.length;
                // if (optLength > 0) {
                //     //-- 填充集数列表
                //     var listHtml = '';
                //     for (var i = 0; i < optLength; i++) {
                //         var item = optList[i];
                //         listHtml += '<div class="FONT-LARGE row-center focusable ' + (i <= currentIndex ? 'current' : "") + ' ' + (item.is_vip ? 'vip-icon' : "") + ' " url="' + item.url + '" index="' + item.index + '">' + item.index + '</div>';
                //     }
                //     $("#play_opt_list .scrollPage").html(listHtml);

                //     //-- 填充选集
                //     var opt = parseInt(optLength / space);
                //     if (opt > 0) {
                //         var optHtml = '';
                //         for (var i = 0; i < opt; i++) {
                //             var start = i * space + 1;
                //             var end = (i + 1) * space;
                //             optHtml += '<div class="focusable" startIndex="' + start + '" endIndex="' + end + '" >' + (start + '-' + end) + '</div>';
                //         }
                //         //-- 取余数
                //         var _y = optLength % space;
                //         if (_y > 0) {
                //             var start_ = opt * space + 1;
                //             optHtml += '<div class="focusable" startIndex="' + start_ + '" endIndex="' + optLength + '" >' + (start_ + '-' + optLength) + '</div>';
                //         }
                //         $("#play_opt_select").html(optHtml);
                //     } else {
                //         $("#play_opt_select").remove();
                //     }
                //     //-- 设置选集的当前状态
                //     var optSelectCurrent = parseInt(currentIndex / space) + 1;
                //     $("#play_opt_select").find(".focusable:nth-child(" + optSelectCurrent + ")").addClass("current");
                // } else {
                //     //-- 移除空白区域
                //     $("#play_play_opt").remove();
                // }
                //-- 初始化视频播放器（从本地加载历史记录）
                var imgs = fun.optImage(data['base_url'], data['16_9']);
                var defaultData = {
                    url: data.url,
                    name: data.name,
                    img: imgs['img']
                };
                initMedia(defaultData);
                //-- 初始化焦点
                initFocus();
                initEvent();
            })
            .catch(function(e) {
                var defaultData = {
                    url: '',
                    name: '',
                    img: ''
                };
                initMedia(defaultData);
                //-- 初始化焦点
                initFocus();
                initEvent();
            })
    }

    function videoPlay() {
        hiddenOpt();
        setTimeout(function() {
            Media.play();
        }, 400)
    }

    //-- 隐藏视频详情层并初始化用户活动状态
    function hiddenOpt() {
        //-- 隐藏视频详情层
        $("#play_container").addClass('container-hidden');
        //-- 设置焦点到播放器
        Media.setFocus();
        //-- 初始化用户活动状态  userActivityEvent 
        fun.userActivityEvent().removeEvent();
    }

    function routerBack() {
        //-- 初始化用户活动状态  userActivityEvent 
        fun.userActivityEvent().removeEvent();
        Router.back();
    }

    function initFocus() {
        //-- 集数列表
        SN.add({
            id: 'play_opt_list',
            selector: '#play_opt_list .focusable',
            straightOnly: true,
            enterTo: 'last-focused',
            leaveFor: {
                up: "@video_buttons",
                down: "#play_opt_select .focusable.current"
            }
        });

        //-- 选集列表
        SN.add({
            id: 'play_opt_select',
            selector: '#play_opt_select .focusable',
            straightOnly: true,
            enterTo: 'last-focused',
        });

        //-- 推荐
        var upTo = $("#play_opt_select .focusable").length > 0 ? '@play_opt_select' : $("#play_opt_list .focusable").length > 0 ? '@play_opt_list' : '@video_buttons';
        SN.add({
            id: 'video_play_recommend',
            selector: '#video_play_recommend .focusable',
            straightOnly: true,
            rememberSource: true,
            leaveFor: {
                up: upTo
            }
        });
        SN.makeFocusable();
    }

    function initEvent() {
        $('#play_video')
            .off('mouseout')
            .on('mouseout', function(e) {
                if (e.clientY < 0) {
                    Media.showMediaComponent();
                }
            })

        // -- 控制集数列表
        $('#play_opt_list .focusable')
            .off('sn:enter-down')
            .on('sn:enter-down', function() {
                $(this).addClass('active');
            })
            .off('sn:enter-up')
            .on('sn:enter-up', function() {
                var $this = $(this);
                videoPlay();
            })
            .off('sn:enter-click')
            .on('sn:enter-click', function() {
                var $this = $(this);
                videoPlay();
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                var index = $(this).index();
                //-- 设置选集的当前状态
                var optSelectCurrent = parseInt(index / space) + 1;
                $("#play_opt_select .focusable").removeClass("current").filter(".focusable:nth-child(" + optSelectCurrent + ")").addClass("current");
                //-- 设置选集栏目up状态（当选集栏有左右移动时，up到集数中间，否者就移动到上一次焦点位置）
                selectMoveStatus = false;
                var detail = e.originalEvent.detail;
                if (detail.direction == 'left' || detail.direction == 'right') {
                    SN.pause();
                    var _elem = $('#play_opt_list')
                    $(this).ensureHorizontalByIndex(_elem, index, function() {
                        SN.focus(this);
                        SN.resume();
                    });
                } else {
                    //-- 重置垂直滚动高度为0
                    $("#play_pro_rec_container").children().first().css("transform", "translateY(0px)");
                }
            })
            .off('sn:enter-back')
            .on('sn:enter-back', function() {
                hiddenOpt();
                return false;
            })

        // -- 控制快捷选集
        $('#play_opt_select .focusable')
            .off('sn:willunfocus')
            .on('sn:willunfocus', function(e) {
                var detail = e.originalEvent.detail;
                if (detail.direction == 'up' && selectMoveStatus == true) {
                    var index = $(this).index();
                    var totalIndex = $('#play_opt_list .focusable').length;
                    var checkIndex = index * space + 4 > totalIndex ? index * space + 1 : index * space + 4;
                    SN.focus($("#play_opt_list").find(".focusable:nth-child(" + checkIndex + ")").first());
                    return false;
                }
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                var index = $(this).index();
                var totalIndex = $('#play_opt_list .focusable').length;
                var checkIndex = index * space + 3;
                var currentIndex = checkIndex >= totalIndex ? totalIndex : checkIndex < 4 ? 0 : checkIndex;
                //-- 设置选集的当前状态
                var optSelectCurrent = index + 1;
                $("#play_opt_select .focusable").removeClass("current");
                $("#play_opt_select").find(".focusable:nth-child(" + optSelectCurrent + ")").addClass("current");
                var detail = e.originalEvent.detail;
                if (detail.direction == 'left' || detail.direction == 'right') {
                    //-- 设置选集栏目up状态（当选集栏有左右移动时，up到集数中间，否者就移动到上一次焦点位置）
                    selectMoveStatus = true;
                    SN.pause();
                    var _elem = $('#play_opt_list')
                    $(this).ensureHorizontalByIndex(_elem, currentIndex, function() {
                        SN.focus(this);
                        SN.resume();
                    });
                } else {
                    //-- 重置垂直滚动高度为0
                    $("#play_pro_rec_container").children().first().css("transform", "translateY(0px)");
                }
            })
            .off('sn:enter-back')
            .on('sn:enter-back', function() {
                hiddenOpt();
                return false;
            })

        // -- 内容推荐列表
        $('#video_play_recommend .focusable')
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                var detail = e.originalEvent.detail;
                if (detail.direction == 'up' || detail.direction == 'down') {
                    SN.pause();
                    var _elem = $('#play_pro_rec_container')
                    $(this).ensureVerticalByTopAndBottom(_elem, function() {
                        SN.focus(this);
                        SN.resume();
                    }, 20, 20);
                }
            })
            .off('sn:navigatefailed')
            .on('sn:navigatefailed', function(e) {
                var detail = e.originalEvent.detail;
                if (detail.direction == 'up') {
                    if ($("#play_opt_select .focusable").length > 0) {
                        SN.focus("@play_opt_select");
                        return false;
                    }
                    if ($("#play_opt_list .focusable").length > 0) {
                        SN.focus("@play_opt_list");
                        return false;
                    }
                    SN.focus("@video_buttons");
                }
            })
            .off('sn:enter-back')
            .on('sn:enter-back', function() {
                hiddenOpt();
                return false;
            })
    }

    function init() {
        if (Router.checkPageExist()) {
            initHtml();
        }
        initData();
    }
    return { init: init }
})