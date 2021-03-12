requirejs.config({
    "baseUrl": "/app",
    "urlArgs": "bust=1.0.3",
    "paths": {
        "i18n": "lib/i18n",
        "navigation": "lib/navigation",
        "jquery": "lib/jquery",
        "text": "lib/require-text",
        "css": "lib/require-css/css",
        "animation": "lib/animation",
        "domReady": "lib/domReady",
        "media": "plugin/media/video.min"
    },
    "shim": {
        'media': {
            deps: ["global/window", "global/document"], //deps里面就是该js文件依赖的模块。
            exports: "videojs" //这里的exports就是模块的返回值
        }
    },
    "config": {
        "unity/network": {
            "APIURL": "http://192.168.28.198:8090"
        }
    }
});

function checkRTL() {
    var language = typeof navigator == 'undefined' ? 'root' :
        ((navigator.languages && navigator.languages[0]) ||
            navigator.language ||
            navigator.userLanguage || 'root').toLowerCase();
    var arr = ['fa', 'he', 'ar', 'ur'];
    return arr.indexOf(language) > -1;
}

//-- 由于使用requireJs 加载videojs 依赖时， videoJs 会依赖 "global/window"和"global/document" 导致报错，故此处需define 定义
define('global/window', [], function() {
    return window;
});

define('global/document', ['global/window'], function(window) {
    return window.document;
});


if (checkRTL()) {
    document.getElementById("container").setAttribute("dir", "rtl");
    window.rtl = true;
}

//-- 加载msg插件
require(['plugin/msg/index', 'plugin/focusEvent/index']);

//-- 加载头部
require(['unity/historyRouter', 'navigation', 'animation', 'component/theme/index', 'plugin/mouseLayout/index'], function(Router, SN) {
    Router.init();
    SN.init();
    //-- 定义路由
    Router.get('/', function(req) {
        require(['component/homeLayout/index'], function(module) {
            try {
                //- 如果是系统页返回并且该页面已经渲染，则只check焦点
                if (req.type != 'systemBack' || !Router.checkPageExist()) {
                    module.init();
                    //-- 切换页面显示
                    Router.pageAnimation();
                } else {
                    //-- 切换页面显示
                    Router.pageAnimation();
                    //-- 初始化当前页面焦点
                    module.checkFocus();
                    return false;
                }
            } catch (e) {
                console.log(e);
            }

            //-- 加载videos模块
            require(['component/videoComponent/BannerDefault/index'], function(module) {
                try {
                    module.init({
                        container: "video_container_1"
                    })
                } catch (e) {
                    console.log(e);
                }
            })

            require(['component/videoComponent/RecommendDefault/index'], function(module) {
                try {
                    module.init({
                        container: "video_container_2"
                    })
                } catch (e) {
                    console.log(e);
                }
            })
        });
    })

    Router.get('/category/:id', function(req) {
        try {
            require(['component/videoModule/index'], function(module) {
                //- 如果是系统页返回并且该页面已经渲染，则只check焦点
                if (req.type != 'systemBack' || !Router.checkPageExist()) {
                    module.init();
                } else {
                    module.checkFocus();
                }
                Router.pageAnimation();
            })
        } catch (e) {
            console.log(e);
        }
    })

    Router.get('/watch/:id', function(req) {
        try {
            require(['component/watchVideo/index'], function(module) {
                if (req.type != 'systemBack' || !Router.checkPageExist()) {
                    module.init();
                } else {

                }
                Router.pageAnimation();
                module.checkFocus();
            })
        } catch (e) {
            console.log(e);
        }
    })

    Router.get('/play/:id', function(req) {
        try {
            require(['component/playVideo/index'], function(module) {
                module.init();
                Router.pageAnimation();
            })
        } catch (e) {
            console.log(e);
        }
    })

    Router.get('/error', function(req, res) {
        try {

        } catch (e) {
            console.log(e)
        }
    })

    //-- 渲染
    Router.render();
})

// requirejs.onError = function(err) {
//     console.log(err.requireType);
//     if (err.requireType === 'timeout') {
//         console.log('module: ' + err.requiremodule);
//     }
//     throw err;
// };