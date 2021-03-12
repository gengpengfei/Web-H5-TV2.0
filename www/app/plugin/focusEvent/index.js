define([
    'jquery',
    'unity/historyRouter'
], function($, Router) {
    'use strict';
    var EventFun = {
        addLoadedEvent: function() {
            document.addEventListener('focusEvent', function(e) {
                console.log('收到可以加载焦点的事件', e);
            })
        },
        //-- 页面加载成功可以初始化焦点时，调用该函数
        pageLoaded: function(detail) {
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent('focusEvent', true, true, detail);
            return document.dispatchEvent(evt);
        }
    }
    EventFun.addLoadedEvent();
});