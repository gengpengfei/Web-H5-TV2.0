define(['jquery', 'module'], function($, module) {
    'use strict';

    function loading() {
        // console.log('loading');
    }

    function stopLoading() {
        // console.log('stopLoading');
    }

    return function(param) {
        var APIURL = module.config().APIURL;
        var _params = {};
        if (window.jsUtil && window.jsUtil.getUrlParam) {
            var obParam = jsUtil.getUrlParam();
        } else {
            obParam = "du=8dcab739206d4984a8dd515a7d06b46c&bt=32&av=2.1.1.169&ls=-1&pt=default&pn=default";
        }

        obParam = obParam.split("&");
        for (var i = 0; i < obParam.length; i++) {
            var key_v = obParam[i].split("=");
            _params[key_v[0]] = key_v[1];
        }
        var commonParams = {
            "projectName": _params['pn'],
            "projectTag": _params['pt'],
            "av": _params['av'],
        }

        var data = param.data ? param.data : {}
        param.data = Object.assign(data, commonParams);

        var options = {
            url: APIURL + param.url,
            type: param.type || 'POST',
            data: JSON.stringify(param.data || {}),
            timeout: param.timeout || 5000,
            dataType: param.dataType || 'json',
            before: param.before || loading,
            complete: param.complete || stopLoading,
            contentType: param.contentType || 'application/json',
        }

        return new Promise(function(resolve, reject) {
            $.ajax({
                url: options.url,
                type: options.type,
                data: options.data,
                timeout: options.timeout,
                dataType: options.dataType,
                contentType: options.contentType,
                beforeSend: options.before,
                complete: options.complete,
                success: function(data) {
                    resolve(data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    /**第一个参数
                     *readyState :当前状态,0-未初始化，1-正在载入，2-已经载入，3-数据进行交互，4-完成
                     *status  ：返回的HTTP状态码，比如常见的404,500等错误代码。
                     *statusText ：对应状态码的错误信息，比如404错误信息是not found,500是Internal Server Error。
                     *responseText ：服务器响应返回的文本信息
                     */

                    /**第二个参数返回的状态
                     *"timeout"（超时）, "error"（错误）, "abort"(中止), "parsererror"（解析错误），还有可能返回空值
                     *字符串类型，表示服务器抛出返回的错误信息
                     */
                    var errInfo = {
                        jqXHR: jqXHR,
                        textStatus: textStatus,
                        errorThrown: errorThrown
                    }
                    reject(errInfo)
                }
            });
        });
    };
});