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
        $("#watch_video").attr('Router', module)
    }

    function initData() {
        var req = Router.params();
        var params = req.params;
        dataFun.getVideoById({ mediaId: params.id }).then(function(res) {
                var data = res.info;
                //-- 添加视频title
                $("#video_title").html(data.name);
                //-- 添加视频说明
                $("#video_direction").html(data.description);
                var imgs = fun.optImage(data['base_url'], data['16_9']);
                //-- 填充背景图片
                $("#watch_video").css({
                    backgroundImage: "url(" + imgs['img'] + ")",
                    backgroundSize: 'cover'
                });
                //-- 填充选集
                var optList = res.materialList;
                //-- 当前观看集数
                var currentIndex = 0;
                var newVideo = optList[currentIndex];

                //-- 填充播放按钮数据
                var $videoPlay = $("#video_play");
                $videoPlay.attr("leaveUrl", newVideo.url);
                $videoPlay.attr("model", newVideo.model);
                $videoPlay.attr("type", newVideo.type);
                $videoPlay.attr("direction", data.direction);
                $videoPlay.attr("isSeries", data.is_series);
                $videoPlay.attr("mediaId", newVideo.media_id);
                $videoPlay.attr("videoId", newVideo.id);

                var optLength = optList.length;
                if (optLength > 1 && data.is_series == 2) {
                    //-- 填充集数列表
                    var listHtml = '';
                    for (var i = 0; i < optLength; i++) {
                        var itemData = optList[i];

                        var $item = $('<div class="FONT-LARGE row-center focusable">' + (i + 1) + '</div>');
                        $item.attr("leaveUrl", itemData.url);
                        $item.attr("model", itemData.model);
                        $item.attr("type", itemData.type);
                        $item.attr("direction", data.direction);
                        $item.attr("isSeries", data.is_series);
                        $item.attr("mediaId", itemData.media_id);
                        $item.attr("videoId", itemData.id);
                        if (i < currentIndex) {
                            $item.addClass('current');
                        }
                        if (itemData.vip == 1) {
                            $item.addClass('vip-icon');
                        }

                        listHtml += $item[0].outerHTML;

                    }
                    $("#video_opt_list .scrollPage").html(listHtml);

                    //-- 填充选集
                    var opt = parseInt(optLength / space);
                    if (opt > 0) {
                        var optHtml = '';
                        for (var i = 0; i < opt; i++) {
                            var start = i * space + 1;
                            var end = (i + 1) * space;
                            optHtml += '<div class="focusable" startIndex="' + start + '" endIndex="' + end + '" >' + (start + '-' + end) + '</div>';
                        }
                        //-- 取余数
                        var _y = optLength % space;
                        if (_y > 0) {
                            var start_ = opt * space + 1;
                            optHtml += '<div class="focusable" startIndex="' + start_ + '" endIndex="' + optLength + '" >' + (start_ + '-' + optLength) + '</div>';
                        }
                        $("#video_opt_select").html(optHtml);
                    } else {
                        $("#video_opt_select").remove();
                    }
                    //-- 设置选集的当前状态
                    var optSelectCurrent = parseInt(currentIndex / space) + 1;
                    $("#video_opt_select").find(".focusable:nth-child(" + optSelectCurrent + ")").addClass("current");
                } else {
                    //-- 移除空白区域
                    $("#video_play_opt").remove();
                }
            }).then(function() {
                //-- 初始化焦点
                initFocus();
                initEvent();
            })
            .catch(function(e) {
                console.log(e);
            })

        dataFun.getVideoRecommend({ mediaId: params.id }).then(function(res) {
            var data = res.list;
            //-- 填充内容推荐
            var rlength = data.length;
            var recommendHtml = '';
            for (var i = 0; i < rlength; i++) {
                var itemData = data[i];
                var $item = $('<div class="content-common focusable"></div>');
                $item.attr("leaveUrl", itemData.url);
                $item.attr("model", itemData.model);
                $item.attr("type", itemData.type);
                $item.attr("direction", itemData.direction);
                $item.attr("isSeries", itemData.is_series);
                $item.attr("mediaId", itemData.id);

                var imgs = fun.optImage(itemData['base_url'], itemData['16_9']);
                $item.html('<img class="item-img" src="' + imgs['img'] + '" onerror="this.style.display=\'none\'" />');
                recommendHtml += $item[0].outerHTML;
            }
            $("#video_watch_recommend").html(recommendHtml);
        }).then(function() {
            //-- 推荐
            var upTo = $("#video_opt_select .focusable").length > 0 ? '@video_opt_select' : $("#video_opt_list .focusable").length > 0 ? '@video_opt_list' : '@video_buttons';
            SN.add({
                id: 'video_watch_recommend',
                selector: '#video_watch_recommend .focusable',
                straightOnly: true,
                rememberSource: true,
                leaveFor: {
                    up: upTo
                }
            });
            SN.makeFocusable();

            // -- 内容推荐列表
            $('#video_watch_recommend .focusable')
                .off('sn:enter-down')
                .on('sn:enter-down', function() {
                    $(this).addClass('active');
                })
                .off('sn:enter-up')
                .on('sn:enter-up', function() {
                    var $this = $(this);
                    $this.removeClass('active');
                    var mediaId = $this.attr("mediaId");
                    //-- 更新模式
                    fun.updataGameModelByElem($this);
                    //-- 跳转到列表页
                    Router.push('/watch/' + mediaId, true);
                })
                .off('sn:enter-click')
                .on('sn:enter-click', function(e) {
                    var $this = $(this);
                    $this.removeClass('active');
                    var mediaId = $this.attr("mediaId");
                    //-- 更新模式
                    fun.updataGameModelByElem($this);
                    //-- 跳转到列表页
                    Router.push('/watch/' + mediaId, true);
                })
                .off('sn:willfocus')
                .on('sn:willfocus', function(e) {
                    var detail = e.originalEvent.detail;
                    if (detail.direction == 'up' || detail.direction == 'down' || detail.direction == undefined) {
                        SN.pause();
                        var _elem = $('#video_pro_rec_container')
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
                        if ($("#video_opt_select .focusable").length > 0) {
                            SN.focus("@video_opt_select");
                            return false;
                        }
                        if ($("#video_opt_list .focusable").length > 0) {
                            SN.focus("@video_opt_list");
                            return false;
                        }
                        SN.focus("@video_buttons");
                    }
                })
        }).catch(function(e) {
            console.log(e);
        })
    }

    function initFocus() {
        // 播放
        SN.add({
            id: 'video_buttons',
            selector: '#video_buttons .focusable',
            straightOnly: true
        });

        //-- 集数列表
        SN.add({
            id: 'video_opt_list',
            selector: '#video_opt_list .focusable',
            straightOnly: true,
            enterTo: 'last-focused',
            leaveFor: {
                up: "@video_buttons",
                down: "#video_opt_select .focusable.current"
            }
        });

        //-- 选集列表
        SN.add({
            id: 'video_opt_select',
            selector: '#video_opt_select .focusable',
            straightOnly: true,
            enterTo: 'last-focused',
        });
        SN.makeFocusable();
        Router.pageSuccess();
        $("body").css({ filter: 'none' });
    }

    function initEvent() {
        $("#watch_video")
            .off('sn:enter-back')
            .on('sn:enter-back', function() {
                Router.back();
            })

        $('#video_buttons .focusable')
            .off('sn:enter-down')
            .on('sn:enter-down', function() {
                $(this).addClass('active');
            })
            .off('sn:enter-up')
            .on('sn:enter-up', function() {
                var $this = $(this);
                var key = $this.attr('id');
                if (key == 'video_play') {
                    fun.contentJump($this);
                }
            })
            .off('sn:enter-click')
            .on('sn:enter-click', function() {
                var $this = $(this);
                var key = $this.attr('id');
                if (key == 'video_play') {
                    fun.contentJump($this);
                }
            })

        // -- 控制集数列表
        $('#video_opt_list .focusable')
            .off('sn:enter-down')
            .on('sn:enter-down', function() {
                $(this).addClass('active');
            })
            .off('sn:enter-up')
            .on('sn:enter-up', function() {
                var $this = $(this);
                //-- 媒资跳转
                fun.contentJump($this);
            })
            .off('sn:enter-click')
            .on('sn:enter-click', function() {
                var $this = $(this);
                //-- 媒资跳转
                fun.contentJump($this);
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                var index = $(this).index();
                //-- 设置选集的当前状态
                var optSelectCurrent = parseInt(index / space) + 1;
                $("#video_opt_select .focusable").removeClass("current").filter(".focusable:nth-child(" + optSelectCurrent + ")").addClass("current");
                //-- 设置选集栏目up状态（当选集栏有左右移动时，up到集数中间，否者就移动到上一次焦点位置）
                selectMoveStatus = false;
                var detail = e.originalEvent.detail;
                if (detail.direction == 'left' || detail.direction == 'right' || detail.direction == undefined) {
                    SN.pause();
                    var _elem = $('#video_opt_list')
                    $(this).ensureHorizontalByIndex(_elem, index, function() {
                        SN.focus(this);
                        SN.resume();
                    });
                }
                //-- 重置垂直滚动高度为0
                $("#video_pro_rec_container").children().first().css("transform", "translateY(0px)");
            })

        // -- 控制快捷选集
        $('#video_opt_select .focusable')
            .off('sn:willunfocus')
            .on('sn:willunfocus', function(e) {
                var detail = e.originalEvent.detail;
                if (detail.direction == 'up' && selectMoveStatus == true) {
                    var index = $(this).index();
                    var totalIndex = $('#video_opt_list .focusable').length;
                    var checkIndex = index * space + 4 > totalIndex ? index * space + 1 : index * space + 4;
                    SN.focus($("#video_opt_list").find(".focusable:nth-child(" + checkIndex + ")").first());
                    return false;
                }
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                var index = $(this).index();
                var totalIndex = $('#video_opt_list .focusable').length;
                var checkIndex = index * space + 3;
                var currentIndex = checkIndex >= totalIndex ? totalIndex : checkIndex < 4 ? 0 : checkIndex;
                //-- 设置选集的当前状态
                var optSelectCurrent = index + 1;
                $("#video_opt_select .focusable").removeClass("current");
                $("#video_opt_select").find(".focusable:nth-child(" + optSelectCurrent + ")").addClass("current");
                var detail = e.originalEvent.detail;
                if (detail.direction == 'left' || detail.direction == 'right' || detail.direction == undefined) {
                    //-- 设置选集栏目up状态（当选集栏有左右移动时，up到集数中间，否者就移动到上一次焦点位置）
                    if (detail.direction != undefined) selectMoveStatus = true;
                    SN.pause();
                    var _elem = $('#video_opt_list')
                    $(this).ensureHorizontalByIndex(_elem, currentIndex, function() {
                        SN.focus(this);
                        SN.resume();
                    });
                }

                //-- 重置垂直滚动高度为0
                $("#video_pro_rec_container").children().first().css("transform", "translateY(0px)");

            })
    }

    function checkFocus() {
        var params = Router.params();
        var lastUid = Router.getRouteLastFocus();
        var $lastFocus = $("[_uid='" + lastUid + "']");
        if ($lastFocus.length > 0 && (params.type == 'systemBack' || params.type == 'externalBack')) {
            SN.focus($lastFocus);
        } else {
            SN.focus('@video_buttons');
        }
    }

    function init() {
        $("body").css({ filter: 'blur(0.3vw)' });
        initHtml();
        initData();
    }
    return { init: init, checkFocus: checkFocus }
})