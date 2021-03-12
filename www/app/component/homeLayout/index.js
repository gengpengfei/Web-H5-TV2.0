define([
    'jquery',
    'navigation',
    'unity/historyRouter',
    'text!component/homeLayout/index.html',
    'css!component/homeLayout/index.css',
], function($, SN, Router, view) {
    'use strict';

    function initHtml() {
        $("#container").append(view);
        //-- 添加路由标识 用于 historyRouter 方法 pageAnimation 切换页面显示
        var path = location.pathname;
        var module = path.split('/')[1];
        $("#homelayout").attr('Router', module)
    }

    function init() {
        initHtml();
        $("#homelayout")
            .off('sn:enter-back')
            .on('sn:enter-back', function() {
                history.go(-1);
            })
    }

    //-- 控制当前页面的焦点
    function checkFocus() {
        var params = Router.params();
        var lastUid = Router.getRouteLastFocus();
        var $lastFocus = $("[_uid='" + lastUid + "']");
        if ($lastFocus.length > 0 && params.type == 'systemBack') {
            //-- 设置上一次点击的焦点
            SN.focus($lastFocus);
        } else {
            //-- 设置默认焦点
            SN.focus('@video_banner');
        }
    }

    return { init: init, checkFocus: checkFocus }
});