define([], function() {

    //-- 存储路由及参数
    var routes = []
    var req = {
        "lastFocus": {}
    }

    var regexps = [
        /[\-{}\[\]+?.,\\\^$|#\s]/g,
        /\((.*?)\)/g,
        /(\(\?)?:\w+/g,
        /\*\w+/g,
    ]

    //-- 路由匹配
    function extractRoute(route) {
        var matchs = []
        route = route.replace(regexps[0], '\\$&')
            .replace(regexps[1], '(?:$1)?')
            .replace(regexps[2], function(match, optional) {
                if (match) matchs.push(match.replace(':', ''))
                return optional ? match : '([^/?]+)'
            }).replace(regexps[3], function(match, optional) {
                if (match) matchs.push(match.replace('*', ''))
                return '([^?]*?)'
            })
        return {
            regexp: new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$'),
            matchs: matchs
        }
    }

    //-- 匹配路由参数
    function extractParams(route, path) {
        var params = route.exec(path).slice(1)
        var results = []
        for (var i = 0; i < params.length; i++) {
            params[i] && results.push(decodeURIComponent(params[i]) || null)
        }
        return results
    }

    //-- 匹配url参数
    function extractQuery() {
        var url = location.search
        var pattern = /(\w+)=([^\?|^\&]+)/ig
        var query = {}
        url.replace(pattern, function(a, b, c) {
            query[b] = c;
        })
        return query;
    }
    var Router = {};

    //-- 自定义监听
    function _dispatchEvent(type) {
        var orig = history[type];
        return function() {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };

    function controller(callback) {
        return function(req) {
            //-- 执行渲染的回调
            callback(req);
        }
    }

    function setLastFocus() {
        var lastFocus = document.activeElement.getAttribute("_uid");
        lastFocus && sessionStorage.setItem(req.route, lastFocus)
    }

    var Router = {
        //-- 初始化监听
        init: function() {
            window.addEventListener('popstate', this.render);
            // -- 自定义pushState监听事件
            history.pushState = _dispatchEvent('pushState');

            window.addEventListener('pushState', this.render);

            history.replaceState = _dispatchEvent('replaceState')

            window.addEventListener('replaceState', this.render);
        },
        get: function(path, fn) {
            routes.push({ path: path, fn: controller(fn) });
        },
        push: function(path, isReplace = false) {
            //-- 保存当前页面的焦点
            setLastFocus();

            //-- 获取当前历史栈
            var _path = location.pathname;
            if (_path.replace(/\//, '') === path.replace(/\//, '')) {
                return false;
            }
            if (isReplace) {
                history.replaceState({ 'from': _path, 'to': path }, null, path);
            } else {
                history.pushState({ 'from': _path, 'to': path }, null, path);
            }
        },
        back: function() {
            history.back();
        },
        locationHref: function($this, isSave) {
            //-- 保存当前页面的焦点
            if (isSave !== false) setLastFocus();
            var leaveUrl = $this.attr("leaveUrl");
            if (leaveUrl) window.location.href = leaveUrl
        },

        locationReplace: function($this, isSave) {
            //-- 保存当前页面的焦点
            if (isSave !== false) setLastFocus();
            var leaveUrl = $this.attr("leaveUrl");
            if (leaveUrl) window.location.replace = leaveUrl
        },
        render: function(e) {
            var match = false
            req.url = location.href
            req.path = location.pathname
            req.query = extractQuery()
            req.state = history.state || {}
            req.route = location.pathname.split('/')[1];

            //-- 如果当前是OB1.0存量设备，需要切换为焦点模式
            if (window.sraf_ext) {
                window.sraf_ext.view.hideCursor();
            }

            //-- 判断页面来源
            var navigation_type = window.performance.navigation.type;
            var history_type = e ? e.type : null;
            var type = 'firstLoad';
            //-- 首次进入
            if (!history_type && navigation_type == 0) {
                type = 'firstLoad'
            }

            //-- 刷新
            if (!history_type && navigation_type == 1) {
                type = 'refresh'
            }

            //-- 外网页面返回
            if (!history_type && navigation_type == 2) {
                type = 'externalBack'
            }

            //-- 内部页面返回
            if (history_type && history_type == 'popstate') {
                type = 'systemBack'
            }

            //-- 内部页面跳转
            if (history_type && history_type == 'pushState') {
                type = 'systemPush'
            }

            //-- 内部页面替换
            if (history_type && history_type == 'replaceState') {
                type = 'systemReplace'
            }
            req.type = type;
            for (var i = 0; i < routes.length; i++) {
                var route = extractRoute(routes[i].path);
                if (!route.regexp.test(req.path)) {
                    continue
                }
                match = true
                var results = extractParams(route.regexp, req.path)
                req.params = req.params || {}
                for (var j = 0; j < route.matchs.length; j++) {
                    req.params[route.matchs[j]] = results[j]
                }
                routes[i].fn.call(this, req);
                return;
            }

            //-- 如果匹配不到路由，直接走error
            var error = routes.filter(function(e) {
                return e.path == '/error'
            })
            error[0] && error[0].fn.call(this, req);
        },
        params: function() {
            return req;
        },
        pageAnimation: function() {
            //-- 当前模块
            var module = req.path.split('/')[1];
            //-- 控制页面显示
            var _o = document.querySelector(".block")
            _o && _o.classList.remove("block");
            var _n = document.querySelector("[router='" + module + "']")
            _n && _n.classList.add("block")
        },
        checkPageExist: function() {
            //-- 当前模块
            var module = req.path.split('/')[1];
            return $("[router='" + module + "']").length > 0 ? true : false;
        },
        getRouteLastFocus: function() {
            return sessionStorage.getItem(req.route);
        },

        checkFocus: function() {
            var params = Router.params();
            var lastUid = Router.getRouteLastFocus();
            var $lastFocus = $("[_uid='" + lastUid + "']");
            if ($lastFocus.length > 0 && (params.type == 'systemBack' || params.type == 'externalBack')) {
                SN.focus($lastFocus);
            } else {
                SN.focus('@video_buttons');
            }
        }
    }

    return Router;
})