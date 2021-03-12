define(['jquery'], function($) {
    function getParams() {
        var _params = {};
        var obParam = "du=''&bt=32&pt=&av=0.0.0.0&ls=-1&pn=";
        if (window.jsUtil && window.jsUtil.getUrlParam) {
            obParam = jsUtil.getUrlParam();
        }

        if (window.sraf && window.sraf.storage && window.sraf.storage.getOBHeaderParam) {
            obParam = sraf.storage.getOBHeaderParam();
        }
        if (window.location.search.indexOf('tp')) {
            obParam = window.location.search;
        }
        obParam = obParam.split("&");
        for (var i = 0; i < obParam.length; i++) {
            var key_v = obParam[i].split("=");
            _params[key_v[0]] = key_v[1];
        }
        return _params;
    }

    function addCssLink(url) {
        var link = $('<link>');
        link.attr('rel', 'stylesheet');
        link.attr('type', 'text/css');
        link.attr('href', url);
        $('head').append(link);
    }

    //-- 加载主题
    var params = getParams();
    if (window.location.search.indexOf('tp') && params['pn'] == 'Coocaa_T921D') {
        addCssLink('/app/component/theme/theme_default_low.cs');
    } else {
        addCssLink('/app/component/theme/theme_default.cs');
    }
})