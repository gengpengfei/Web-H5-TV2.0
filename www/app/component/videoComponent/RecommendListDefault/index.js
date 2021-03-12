define([
    'jquery', 'navigation', 'unity/data', 'unity/commonFun', 'unity/historyRouter', 'css!./index.css'
], function($, SpatialNavigation, dataFun, fun, Router) {
    var SN = SpatialNavigation;

    function initHtml(container) {
        $("#" + container).html('<div class="recommend-list-container" id="recommend_list"></div>');
    }

    function initData() {
        dataFun.getCategoryVideos().then(function(res) {
                var data = res.list;
                if (data.length == 0) return false;

                for (var j = 0; j < data.length; j++) {
                    var categoryData = data[j];
                    if (categoryData['video'].length == 0) continue;
                    var $categoryItem = $('<div class="video-category-item"></div>');
                    //-- 添加标题
                    var $categoryTitle = $('<div class="category-title"><div class="title FONT-MEDIUM">' + categoryData.category_name + '</div></div>');
                    $categoryItem.append($categoryTitle);
                    //-- 添加视频列表
                    var $videoList = $('<div class="video-category-content row-between"></div>')
                    var videosData = categoryData.video;
                    var length = videosData.length;
                    //-- 如果分类下视频少于5款 ，不显示该分类
                    if (length < 4) {
                        continue;
                    } else if (length > 3 && length < 8) {
                        //-- 少于10款时，只显示一行
                        length = 4
                    } else if (length > 8) {
                        length = 12
                    }
                    for (var i = 0; i < length; i++) {
                        var $videoItem = $('<div class="content-item MARGIN-BUTTOM"></div>')
                        var $contentItem = $('<div class="content-common focusable"></div>')
                        if (i < 11) {
                            var itemData = videosData[i];
                            var html = '';
                            $contentItem.attr("leaveUrl", itemData.url);
                            $contentItem.attr("model", itemData.model);
                            $contentItem.attr("type", itemData.type);
                            $contentItem.attr("direction", itemData.direction);
                            $contentItem.attr("isSeries", itemData.is_series);
                            $contentItem.attr("mediaId", itemData.media_id);

                            var imgs = fun.optImage(itemData['base_url'], itemData['16_9']);

                            if (imgs['bg_img']) html += '<img class="item-img" src="' + imgs['bg_img'] + '" onerror="this.style.display=\'none\'" />'
                            if (imgs['img']) html += '<img class="item-img" src="' + imgs['img'] + '" onerror="this.style.display=\'none\'" />';
                            $contentItem.html(html);
                            $videoItem.html($contentItem);
                            $videoList.append($videoItem);
                        } else {
                            //-- 添加 more 按钮
                            var $moreItem = $('<div class="content-item WIDTH-5 MARGIN-BUTTOM"><div class="content-common more-common focusable"></div>')
                            $moreContent = $moreItem.find(".content-common");
                            $moreContent.attr("type", 'more');
                            $moreContent.attr("category", categoryData.category_id);
                            $videoList.append($moreItem)
                        }
                    }
                    //-- 添加游戏列表
                    $categoryItem.append($videoList);
                    //-- 添加到容器
                    $('#recommend_list').append($categoryItem);
                }
            }).then(function() {
                //-- 初始化焦点
                initFocus();
                initEvent();
            })
            // .catch(function(e) {
            //     console.log(e);
            //     //-- 移除当前模块
            //     remove();
            // })
    }



    function initFocus() {
        // 头部
        SN.add({
            id: 'recommend_list',
            selector: '#recommend_list .focusable',
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
        $('#recommend_list .focusable')
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
                var type = $this.attr('type');
                var mediaId = $this.attr('mediaId');
                var categoryId = $this.attr('category');
                if (type == 'more') {
                    //-- 跳转到更多
                    Router.push('/category/' + categoryId);
                } else {
                    //-- 跳转到列表页
                    Router.push('/watch/' + mediaId);
                }
            })
            .off('sn:enter-click')
            .on('sn:enter-click', function() {
                var $this = $(this);
                $this.removeClass('active');
                //-- 更新模式
                fun.updataGameModelByElem($this);
                var type = $this.attr('type');
                var categoryId = $this.attr('category');
                if (type == 'more') {
                    //-- 跳转到更多
                    Router.push('/category/' + categoryId);
                } else {
                    //-- 跳转到列表页
                    Router.push('/watch/' + mediaId);
                }
            })
            .off('sn:willfocus')
            .on('sn:willfocus', function(e) {
                var detail = e.originalEvent.detail;
                //-- 整体移动页面到顶端动画
                fun.scrollPageAnimation(true);
                if (detail.direction != 'left' && detail.direction != 'right') {
                    SN.pause();
                    var _elem = $('#video_recommend')
                    $(this).ensureVertical(_elem, function() {
                        SN.focus(this);
                        SN.resume();
                    });
                }
            });
    }

    function remove() {
        $("#video_category").remove();
        $('#video_category .focusable')
            .off('sn:enter-down')
            .off('sn:enter-up')
            .off('sn:willfocus')
    }

    function init(config) {
        var container = config.container
        initHtml(container);
        initData();
    }
    return {
        init: init
    };
})