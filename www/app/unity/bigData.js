(function(window) {
    'use strict';
    //扩展帮助方法*/
    var helper = {};
    //遍历
    /**
     * @method each
     * @parame loopable 要遍历的对象
     * @parame callback 回调函数
     * @parame self 上下文
     **/
    helper.each = function(loopable, callback, self) {
        var additionalArgs = Array.prototype.slice.call(arguments, 3);
        if (loopable) {
            if (loopable.length === +loopable.length) {
                for (var i = 0; i < loopable.length; i++) {
                    callback.apply(self, [loopable[i], i].concat(additionalArgs));
                }
            } else {
                for (var item in loopable) {
                    callback.apply(self, [loopable[item], item].concat(additionalArgs));
                }
            }
        }
    };

    //扩展
    /**
     *@method extend
     *@parame base 要扩展的对象
     *@return base  返回扩展后的对象
     **/
    helper.extend = function(base) {
        helper.each(Array.prototype.slice.call(arguments, 1), function(extensionObject) {
            helper.each(extensionObject, function(value, key) {
                if (extensionObject.hasOwnPrototype(key)) {
                    base[key] = value;
                }
            });
        });
        return base;
    };

    //返回数组元素所在的位置，确定是否包含在里面
    /**
     *@method indexOf
     *@parame arrayToSearch 查找的对象
     *@parame item 查找的元素
     *@return args  返回位置
     **/
    helper.indexOf = function(arrayToSearch, item) {
        if (Array.prototype.indexOf) {
            return arrayToSearch.indexOf(item);
        } else {
            for (var i = 0; i < arrayToSearch.length; i++) {
                if (arrayToSearch[i] === item) return i;
            }
            return -1;
        }
    };

    //绑定事件
    helper.on = function(target, type, handler) {
        if (target.addEventListener) {
            target.addEventListener(type, handler, false);
        } else {
            target.attachEvent("on" + type,
                function(event) {
                    return handler.call(target, event);
                }, false);
        }
    };

    //取消事件监听
    helper.remove = function(target, type, handler) {
        if (target.removeEventListener) {
            target.removeEventListener(type, handler);
        } else {
            target.detachEvent("on" + type,
                function(event) {
                    return handler.call(target, event);
                }, true);
        }
    };

    //将json转为字符串
    helper.changeJSON2Query = function(jsonObj) {
        var args = '';
        for (var i in jsonObj) {
            if (args != '') {
                args += '&';
            }
            args += i + '=' + encodeURIComponent(jsonObj[i]);
        }
        return args;
    };

    //将相对路径解析成文档全路径
    helper.normalize = function(url) {
        var a = document.createElement('a');
        a.setAttribute('href', url)
        return a.href;
    }

    //拷贝元素
    helper.copyObj = function(copyObj) {
            var obj = {};
            for (var i in copyObj) {
                obj[i] = copyObj[i];
            }
            return obj;
        }
        //-- 生成ouid
    helper.createOuid = function() {
            var d = new Date().getTime();
            return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                var v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        //-- 设置cookie
    helper.setCookie = function(cname, cvalue) {
        var d = new Date();
        d.setTime(Date.UTC(d.getFullYear() + 2));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires;
    }

    //-- 获取cookie
    helper.getCookie = function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return false;
    }

    //-- 设置 localStorage 
    helper.setLocalStorage = function(lname, lvalue) {
        window.localStorage.setItem(lname, lvalue);
    }

    //-- 获取 localStorage 
    helper.getLocalStorage = function(lname) {
        if (window.localStorage) {
            return window.localStorage.getItem(lname);
        } else {
            return false;
        }
    }

    //-- 保存ouid
    helper.setOuidForStorage = function(ouid) {
        if (window.localStorage) {
            helper.setLocalStorage('ouid', ouid);
        }
        if (document.cookie) {
            helper.setCookie('ouid', ouid);
        }
    }

    //-- 从存储里面获取ouid
    helper.getOuidByStorage = function() {
            var ouid;
            if (document.cookie) {
                ouid = helper.getCookie('ouid');
                if (ouid) return ouid;
            }
            if (window.localStorage) {
                ouid = helper.getLocalStorage('ouid');
                if (ouid) return ouid;
            }
        }
        //初始化采集对象
    var collect = {
        eventUrl: 'https://sg.hub.srafcloud.com/hp/bucket',
        srafObToken: 'd62xd1bgawac232xa3hk18Fx',
        policyUrl: 'https://policy.seraphic-corp.com/webPolicy',
        params: {
            version: '',
            event_type: '',
            event_name: '',
            timestamp: '',
            ouid: '',
            event_data: {
                APPEvent: {

                }
            }
        },
        ouid: '',
        device: {},
        //-- 用于判断策略是否返回
        policyResponse: true
    };
    //-- 临时使用数据库收集游戏和视频Pv信息
    collect.setMysqlStatusData = function(event_name) {
        var postUrl = 'http://3.132.55.194:8088/webpagePv';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', postUrl)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        var devices = collect.getDevice();
        var obj = {
            event_name: event_name,
            project_name: devices.ProjectName,
            project_tag: devices.ProjectTag,
            country: devices.Country
        }
        var arr = [];
        var i = 0;
        for (var attr in obj) {
            arr[i] = encodeURIComponent(attr) + "=" + encodeURIComponent(obj[attr]);
            i++;
        }
        xhr.send(arr.join("&"))
    }

    //-- 临时使用数据库收集游戏和视频跳转 信息
    collect.setMysqlClickData = function(event_name, element) {
            var postUrl = 'http://3.132.55.194:8088/webpageClick';
            var url = element.getAttribute('clickUrl');
            var xhr = new XMLHttpRequest();
            xhr.open('POST', postUrl);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
            var devices = collect.getDevice();
            var obj = {
                event_name: event_name,
                url: url,
                project_name: devices.ProjectName,
                project_tag: devices.ProjectTag,
                country: devices.Country
            }
            var arr = [];
            var i = 0;
            for (var attr in obj) {
                arr[i] = encodeURIComponent(attr) + "=" + encodeURIComponent(obj[attr]);
                i++;
            }
            xhr.send(arr.join("&"))
        }
        //-- 设备启动事件入队
    collect.setHomeLaunchEvent = function() {
        var params = { event_data: { APPEvent: {} } };
        params.event_name = 'WebDeviceStatus'
            //-- 获取设备信息
        params.event_data.APPEvent.WebDeviceStatus = collect.getDevice()
        collect.setEvent(params);
    }
    collect.setDOMContentLoadedEvent = function() {
            this.setHomePageStatusEvent();
            this.setTabPvEvent();
        }
        //-- 首页Pv事件入队
    collect.setHomePageStatusEvent = function() {
            var params = { event_data: { APPEvent: {} } };
            params.event_name = 'HomePageStatus';
            params.event_data.APPEvent['HomePageStatus'] = {};
            collect.setEvent(params);
        }
        //-- 用户首次进入主页 PV 事件
    collect.setTabPvEvent = function() {
            var hash = window.location.hash.substring(1);
            if (!hash) hash = document.getElementById('h_cat').firstElementChild.getAttribute('id');
            var tab_n = hash.split('_')[2];
            var event_name;
            switch (tab_n) {
                case '1':
                    event_name = 'RecommendPageStatus';
                    break;
                case '2':
                    event_name = 'VideoPageStatus';
                    setTimeout(collect.setMysqlStatusData(event_name), 1000);
                    break;
                case '3':
                    event_name = 'GamePageStatus';
                    setTimeout(collect.setMysqlStatusData(event_name), 1000);
                    break;
                case '4':
                    event_name = 'BookmarkPageStatus';
                    break;
            }
            var params = { event_data: { APPEvent: {} } };
            params.event_name = event_name;
            if (event_name == "RecommendPageStatus") {
                var _rs = document.getElementById('h_recommend');
                var _s = _rs.getElementsByTagName('li');
                var _p = [];
                for (var i = 0; i < _s.length; i++) {
                    var url = _s[i].getAttribute("clickUrl");
                    var index = _s[i].getAttribute('index');
                    _p.push({ url: url, index: parseInt(index) })
                }
                params.event_data.APPEvent.RecommendPageStatus = _p
            }
            collect.setEvent(params);
        }
        //-- 用户切换 tab Pv监听
    collect.tabPageEvent = function() {
            var that = this;
            that.callback = function(mutationsList) {
                var dom = mutationsList[0].target;
                if (dom.classList.contains('current')) {
                    var id = dom.getAttribute('id');
                    var tab_n = id.split('_')[2];
                    var event_name;
                    switch (tab_n) {
                        case '1':
                            event_name = 'RecommendPageStatus';
                            break;
                        case '2':
                            event_name = 'VideoPageStatus';
                            setTimeout(collect.setMysqlStatusData(event_name), 1000);
                            break;
                        case '3':
                            event_name = 'GamePageStatus';
                            setTimeout(collect.setMysqlStatusData(event_name), 1000);
                            break;
                        case '4':
                            event_name = 'BookmarkPageStatus';
                            break;
                    }
                    var params = { event_data: { APPEvent: {} } };
                    params.event_name = event_name;
                    if (event_name == "RecommendPageStatus") {
                        var _rs = document.getElementById('h_recommend');
                        var _s = _rs.getElementsByTagName('li');
                        var _p = [];
                        for (var i = 0; i < _s.length; i++) {
                            var url = _s[i].getAttribute("clickUrl");
                            var index = _s[i].getAttribute('index');
                            _p.push({ url: url, index: parseInt(index) })
                        }
                        params.event_data.APPEvent.RecommendPageStatus = _p
                    }
                    collect.setEvent(params);
                }
            }
            var mutationObserver = new MutationObserver(that.callback);
            var targetNode = document.getElementById("h_cat").children;
            var options = {
                'attributes': true
            };

            for (var i = 0; i < targetNode.length; i++) {
                mutationObserver.observe(targetNode[i], options);
            }
        }
        //-- bookmark 列表埋点
    collect.setBookmarkListEvent = function() {
        var oPlugin = document.getElementById('sraf_config_sraf');
        var total_entry;
        var list = [];
        if (oPlugin) {
            try {
                total_entry = oPlugin.getBookmarkCount();
                if (total_entry > 0) {
                    for (var i = 0; i < total_entry; i++) {
                        var oneEntry = oPlugin.getBookmarkByIndex(i);
                        if (oneEntry) {
                            var data = {};
                            data.index = i;
                            data.url = oneEntry[2];
                            list.push(data);
                        }
                    }
                }
                if (list.length > 0) {
                    var params = { event_data: { APPEvent: { BookmarkList: list } } };
                    params.event_name = 'BookmarkList';
                    collect.setEvent(params);
                }
            } catch (err) {
                return;
            }
        }
    }

    //-- 用户使用搜索框埋点
    collect.useSearchInputEvent = function() {
        var dom = document.getElementById("searchInput");
        if (dom) {
            dom.addEventListener('keyup', function(e) {
                if (e.keyCode === 13) {
                    var url = document.getElementById("searchInput").value;
                    if (url) {
                        var params = { event_data: { APPEvent: {} } };
                        params.event_name = "SearchTerms";
                        params.event_data.APPEvent['SearchTerms'] = { "keyWords": url };
                        collect.setEvent(params);
                    }
                }
            })
        }
    }

    //-- 用户点击事件埋点
    collect.useClickEvent = function() {
        //-- 用户键盘点击
        document.addEventListener('keydown', function(e) {
                var keyCode = e.keyCode;
                if (keyCode == 13) {
                    var element = document.querySelector(".active");
                    var focus_id = element.getAttribute("id").split('_');
                    clickEventCallback(element, focus_id)
                }
            })
            //-- 用户鼠标点击
        var element = document.querySelectorAll("[name=focus]");
        for (var i = 0; i < element.length; i++) {
            element[i].onclick = function(e) {
                var element = e.target;
                var focus_id = e.target.id.split('_');
                clickEventCallback(element, focus_id)
            }
        }
    }

    function clickEventCallback(element, focus_id) {
        var position = focus_id[0] + '_' + focus_id[1];
        var event_name, index, name, uuid;
        switch (position) {
            case 'h_recommend':
                event_name = 'RecommendClick';
                index = element.getAttribute('index');
                break;
            case 'h_video':
                event_name = 'VideoClick';
                uuid = element.getAttribute('uuid');
                name = element.getAttribute("clickname");
                setTimeout(collect.setMysqlClickData(event_name, element), 1000);
                break;
            case 'h_video':
                event_name = 'GameClick';
                uuid = element.getAttribute('uuid');
                name = element.getAttribute("clickname");
                setTimeout(collect.setMysqlClickData(event_name, element), 1000);
                break;
            case 'h_bookmarks':
                event_name = 'BookmarkClick';
                break;
        }
        var url = element.getAttribute('clickUrl');
        if (!event_name || !url) return false;
        var params = { event_data: { APPEvent: {} } };
        params.event_name = event_name;
        params.event_data.APPEvent[event_name] = [{ url: url, index: index }]
        if (name) {
            params.event_data.APPEvent[event_name] = [{ url: url, name: name, index: uuid }]
        }
        collect.setEvent(params);
    }

    //-- 用户退出事件监听
    // collect.beforeUnloadEvent = function(e){
    // 	var params = {event_data:{APPEvent:{e}}};
    // 	params.event_name = 'APPQuit';
    //     collect.setEvent(params);
    // }

    //自定义事件埋点
    collect.dispatch = function(event_name, extraInfo) {
        var that = collect;
        var params = { event_data: { APPEvent: {} } };
        params.event_name = event_name;
        params.event_data.APPEvent[event_name] = extraInfo
        that.setEvent(params)
    }

    //设置设备信息
    collect.setDevice = function() {
        if (window && window.screen) {
            this.device.ScreenHigh = window.screen.height || 0;
            this.device.ScreenWide = window.screen.width || 0;
        }
        if (navigator) {
            this.device.Language = navigator.language || '';
        }
        this.device.APPVersion = collect.APPVersion;
        //解析配置项常亮
        if (typeof _XT != "undefined") {
            for (var i in _XT) {
                this.device[i] = _XT[i]
            }
        }
    }

    //设置当前设备的类型
    collect.setAPPVersion = function() {
        var APPVersion = '';
        var u = navigator.userAgent;
        if (u.indexOf('OB/v1.1') > -1) {
            APPVersion = 'OB v1.1';
        } else {
            APPVersion = 'OB v1.0';
        }
        collect.APPVersion = APPVersion;
    }

    //设置当前页面固定参数
    collect.setParames = function() {
        var version = this.getAPPVersion();
        collect.params.event_type = version == 'OB v1.1' ? 'ob_event' : 'ob_event';
        collect.params.version = version;
        collect.params.ouid = this.getDeviceId();
        collect.params.timestamp = new Date().getTime();
    };

    //-- 获取设备id
    collect.getDeviceId = function() {
            var ouid = helper.getOuidByStorage();
            if (!ouid || ouid === null || ouid === 'null') {
                ouid = helper.createOuid();
            }
            //-- 不管是获取的还是新生成的ouid , 都更新一下时间
            helper.setOuidForStorage(ouid);
            return ouid;
        }
        //获取事件参数
    collect.getParames = function() {
        return this.params;
    };

    //获取设备信息
    collect.getDevice = function() {
        return this.device;
    };

    collect.getAPPVersion = function() {
        return this.APPVersion;
    }

    //请求策略服务器，判断可以采集哪些信息
    collect.getPolicy = function() {
        collect.policyEvent = { "MainSwitch": 1, "APPEvent": { "WebDeviceStatus": 1, "BookmarkList": 1, "HomePageStatus": 1, "RecommendPageStatus": 1, "VideoPageStatus": 1, "GamePageStatus": 1, "BookmarkPageStatus": 1, "RecommendClick": 1, "VideoClick": 1, "GameClick": 1, "BookmarkClick": 1, "SearchTerms": 1 } };
        collect.policyResponse = true;
        collect.saveEventQueue();
        return;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (xhr.response) {
                        var res = JSON.parse(xhr.response);
                        if (res.status == 'ok') {
                            collect.policyEvent = res.result;
                            collect.policyResponse = true;
                        }
                        collect.saveEventQueue();
                    }
                }
            }
        };
        xhr.open('POST', collect.policyUrl)
        var device = this.getDevice();
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        var obj = {
            ProjectName: device.ProjectName,
            ProjectTag: device.ProjectTag,
            Version: 'GDPRv1.0',
            DUID: collect.getDeviceId()
        }
        var arr = [];
        var i = 0;
        for (var attr in obj) {
            arr[i] = encodeURIComponent(attr) + "=" + encodeURIComponent(obj[attr]);
            i++;
        }
        xhr.send(arr.join("&"))
    };

    //-- 判断策略
    collect.checkPolicy = function(_obj) {
        if (!collect.policyResponse) return;
        var event_name = _obj.event_name;
        var policyEvent = collect.policyEvent;
        if (policyEvent.MainSwitch != 1) return false;
        if (!policyEvent.APPEvent || policyEvent.APPEvent[event_name] != 1) return false;
        return true;
    }

    //-- 判断事件是入队列还是直接触发
    collect.setEvent = function(_obj) {
        if (!collect.policyResponse) {
            collect.setEventQueue(_obj);
        } else {
            collect.saveEventInfo(_obj);
        }
    }

    //存储加载完成，获取设备类型，记录加载完成信息
    collect.onload = function() {
            collect.getPolicy()
        }
        //-- 拼接参数
    collect.makeParams = function(_params) {
        var _obj = helper.copyObj(collect.getParames());
        for (var key in _params) {
            if (_params.hasOwnProperty(key) === true) {
                _obj[key] = _params[key];
            }
        }
        return _obj
    }

    //-- 保存事件队列，用于获取策略之后发送
    collect.setEventQueue = function(_obj) {
            if (!collect.eventQueue) {
                collect.eventQueue = [];
            }
            collect.eventQueue.push(_obj);
        }
        //采集页面信息,如果是v1.1设备,使用大数据通道
    collect.saveEventInfo = function(_obj) {
        var that = this
            //-- 拼接参数
        var params = collect.makeParams(_obj);
        //-- 判断埋点
        // if(!collect.checkPolicy(_obj)) return;
        if (collect.APPVersion == 'OB v1.1') {
            that.saveEvent(params)
        } else {
            if (params.event_name == 'WebDeviceStatus') {
                setTimeout(function() {
                    that.send(params)
                })
            } else {
                params.ouid = '';
                params.event_data.APPEvent.WebDeviceStatus = collect.getDevice()
                setTimeout(function() {
                    that.send(params)
                })
            }
        }
    }

    //-- 消费事件队列
    collect.saveEventQueue = function() {
        var that = this
        var events = collect.eventQueue.length;
        for (var i = 0; i < events; i++) {
            that.saveEventInfo(collect.eventQueue.shift());
        }
    }

    // v1.1 直接将数信息发给sdk通道
    collect.saveEvent = function(obj) {
        console.log('sdk通道埋点---------------------');
        var type = obj.event_name;
        var data = obj.event_data;
        if (window.sraf_ext) {
            sraf_ext.ui.onEvent(type, JSON.stringify(data))
        }
    }

    // V1.0 走web通道
    collect.send = function(obj) {
        var event_name = obj.event_name;
        $.ajax({
            type: "POST",
            dataType: "json",
            data: JSON.stringify(obj),
            url: collect.eventUrl,
            beforeSend: function(XMLHttpRequest) {
                XMLHttpRequest.withCredentials = false;
                XMLHttpRequest.setRequestHeader("SRAF-OB-TOKEN", collect.srafObToken);
                XMLHttpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                // setTimeout(function(){
                // 	$.ajax({
                // 		type : "GET",
                // 		dataType:"json",
                // 		crossDomain: true,
                // 		url : "http://test.c2vyyxboawmtzmf2b3jpdgvz.com/test.php?type=send&msg=" + event_name,
                // 		success : function(result) {

                // 		}
                // 	});
                // })
            },
            success: function(result) {
                console.log(result)
                    // setTimeout(function(){
                    // 	$.ajax({
                    // 		type : "GET",
                    // 		dataType:"json",
                    // 		crossDomain: true,
                    // 		url : "http://test.c2vyyxboawmtzmf2b3jpdgvz.com/test.php?type=200&msg=" + event_name + '-' + result.msg,
                    // 		success : function() {

                // 		}
                // 	});
                // })
            },
            error: function(error) {
                // setTimeout(function(){
                // 	$.ajax({
                // 		type : "POST",
                // 		dataType:"json",
                // 		data: JSON.stringify(obj),
                // 		url : collect.eventUrl,
                // 		beforeSend: function (XMLHttpRequest) {
                // 			XMLHttpRequest.setRequestHeader("SRAF-OB-TOKEN", collect.srafObToken);
                // 			XMLHttpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                // 		},
                // 		success : function(result) {
                // 			setTimeout(function(){
                // 				$.ajax({
                // 					type : "GET",
                // 					dataType:"json",
                // 					crossDomain: true,
                // 					url : "http://test.c2vyyxboawmtzmf2b3jpdgvz.com/test.php?type=200&msg=" + event_name + '-' + result.msg,
                // 					success : function() {

                // 					}
                // 				});
                // 			})
                // 		}
                // 	})
                // },3000)
                // setTimeout(function(){
                // 	$.ajax({
                // 		type : "GET",
                // 		dataType:"json",
                // 		crossDomain: true,
                // 		url : "http://test.c2vyyxboawmtzmf2b3jpdgvz.com/test.php?type=error&msg=" + event_name + '-' + JSON.stringify(error),
                // 		success : function(result) {

                // 		}
                // 	});
                // })
            }
        });
    }

    // V1.0 走web通道
    collect.sendXml = function(obj) {
        var event_name = obj.event_name;
        var ouid = this.getDeviceId();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', collect.eventUrl, true)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.ontimeout = function(e) {
            setTimeout(function() {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    crossDomain: true,
                    url: "http://test.c2vyyxboawmtzmf2b3jpdgvz.com/test.php?type=timeout&msg=" + event_name,
                    success: function(result) {

                    }
                });
            }, 1000)
        }
        xhr.addEventListener('loadstart', function() {
            setTimeout(function() {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    crossDomain: true,
                    url: "http://test.c2vyyxboawmtzmf2b3jpdgvz.com/test.php?type=loadstart&msg=" + event_name,
                    success: function(result) {

                    }
                });
            }, 1000)
        });
        xhr.addEventListener('error', function(e) {
            setTimeout(function() {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    crossDomain: true,
                    url: "http://test.c2vyyxboawmtzmf2b3jpdgvz.com/test.php?type=error&msg=" + event_name + '-' + e,
                    success: function(result) {

                    }
                });
            }, 1000)
        });
        xhr.onreadystatechange = responseHandler;
        xhr.setRequestHeader('SRAF-OB-TOKEN', collect.srafObToken);
        xhr.send(JSON.stringify(obj))

        function responseHandler() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    xhr.responseText;
                    setTimeout(function() {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            crossDomain: true,
                            url: "http://test.c2vyyxboawmtzmf2b3jpdgvz.com/test.php?type=200&msg=" + JSON.parse(xhr.responseText).code + '-' + event_name,
                            success: function(result) {

                            }
                        });
                    }, 1000)
                } else {
                    setTimeout(function() {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            crossDomain: true,
                            url: "http://test.c2vyyxboawmtzmf2b3jpdgvz.com/test.php?type=404&msg=" + event_name + '-' + xhr.status,
                            success: function(result) {

                            }
                        });
                    }, 1000)
                }
            } else {

            }
        }
    }

    collect.init = function() {
        var that = this;
        //-- 设置设备类型(用于判断OB版本)
        that.setAPPVersion();
        //-- 设置一些公共参数
        that.setParames();
        //-- 设置设备信息
        that.setDevice();
        //-- 拉取主页首先发送设备信息事件队列
        collect.setHomeLaunchEvent();
        //-- bookmark 列表埋点事件队列
        collect.setBookmarkListEvent();
        //-- DOMContentLoaded 事件监听将在所有资源加载完成之后触发,默认焦点在Recommend上
        helper.on(document, 'DOMContentLoaded', collect.setDOMContentLoadedEvent());
        //单页面应用，路由切换触发事件
        // helper.on(window,'popstate', collect.onPopStateHandler)
        //监听页面，用户离开主页的时候触发事件
        // helper.on(window,'beforeunload', collect.beforeUnloadEvent);
        //-- 监听主页 TAB 页面PV
        collect.tabPageEvent();
        //-- 用户使用搜索框埋点
        collect.useSearchInputEvent();
        //-- 用户点击事件埋点
        collect.useClickEvent();
        //-- 开始初始化数据收集策略
        // collect.onload()
    };
    //-- 初始化系统事件监听
    collect.init();
    return {
        dispatch: collect.dispatch,
    }
})(window);