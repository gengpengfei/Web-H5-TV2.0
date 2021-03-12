define(['jquery', 'navigation', 'media', './mediaComponent/index', 'unity/historyRouter', 'css!./index.css', 'css!./video-js.min.css'], function($, SN, videojs, mediaComponent, Router) {
    'use strict';

    var MediaObj = {
        options: {},
        //-- 快进快退的单次步长
        timeSpacing: 0.02,
        //-- 最大步长
        maxTimeSpacing: 0.1,
        //-- 当前是否在快进快退状态
        timeSpacingStatus: false,
        //-- 宽进快退总时间
        timeSpacingTotal: 0,
        mediaPlayer: null,
        init: function(options) {
            this.options = options;

            if (!this.mediaPlayer || (!this.mediaPlayer && this.mediaPlayer.player_)) {
                this.initHtml();
                this.initMediaPlay();
                this.initEvent();
                this.initFocus();
                this.initMediaComponent();
            }
            this.initData();
        },
        //-- 填充html页面
        initHtml: function() {
            var container = this.options.container;
            $("#" + container).html('<video id="media_play" class="video-js focusable"></video>');
        },
        initData: function() {
            //-- 暂停视频
            this.mediaPlayer.pause();
            //-- 设置视频源
            this.mediaPlayer.src([{
                src: this.options.mediaInfo.url,
                type: 'video/mp4'
            }]);
            //-- 刷新视频
            this.mediaPlayer.load();
            //-- 设置海报
            this.mediaPlayer.poster(this.options.mediaInfo.img);
            //-- 填充标题
            var controlBar = this.mediaPlayer.controlBar.contentEl();
            if ($("#vjs_media_title").length > 0) {
                $("#vjs_media_title").html(this.options.mediaInfo.name);
            } else {
                var mediaTitle = $('<div class="vjs-media-title FONT-LARGE THEME-COLOR-DEFAULT" id="vjs_media_title">' + this.options.mediaInfo.name + '</div>');
                $(controlBar).append(mediaTitle);
            }
        },
        initMediaPlay: function() {
            this.mediaPlayer = videojs('media_play', {
                //-- 切换语言
                language: 'zh-CN',
                //-- 设置用户退出活动状态的时间
                inactivityTimeout: 3000,
                //-- 配置首屏播控按钮是否显示
                bigPlayButton: false,
                //-- 屏蔽错误提示，通过on error 监听来自定义错误交互
                errorDisplay: false,
                // 0: "mediaLoader"
                // 1: "posterImage"
                // 2: "textTrackDisplay"
                // 3: "loadingSpinner"
                // 5: "liveTracker"
                // 7: "errorDisplay"
                // 8: "textTrackSettings"
                // 9: "resizeManager"
                //-- 配置controlBar中组件的隐藏和显示
                controlBar: {
                    //-- 全屏
                    fullscreenToggle: false,
                    //-- 音量
                    volumePanel: false,
                    //-- 播放暂停
                    playToggle: false,
                    //-- 画中画
                    pictureInPictureToggle: false,
                    audioTrackButton: false,
                    subsCapsButton: false,
                    descriptionsButton: false,
                    //-- 播放速率菜单
                    playbackRateMenuButton: false,
                    //-- 直播流时，是否显示live
                    liveDisplay: false,
                    //-- 直播状态
                    seekToLive: false,
                    //-- 已播放时间
                    currentTimeDisplay: true,
                    //-- 反斜杠
                    timeDivider: true,
                    //--  视频总时长
                    durationDisplay: true,
                    //-- 进度条
                    progressControl: true,
                    //-- 剩余播放时长
                    remainingTimeDisplay: false,
                    //-- 播控两端空格
                    customControlSpacer: false,
                    chaptersButton: false,
                }
            });
            //-- 是否自动播放
            this.mediaPlayer.autoplay(this.options.autoPlay ? this.options.autoPlay : false);
            //-- 是否打开播控
            this.mediaPlayer.controls(true);
            //-- 启用流体模式
            this.mediaPlayer.fluid(true);
            //-- 如果确定视频的宽高比，则可以设置视频源的宽高比
            this.mediaPlayer.aspectRatio('16:9');
            //-- 视频是否静音
            this.mediaPlayer.muted('false');
            //-- 视频播放结束后，是否循环播放
            this.mediaPlayer.loop(false);
            //-- 配置是否在加载元素后立即开始下载视频数据
            //-- 'auto': 立即开始加载视频（如果浏览器支持的话）
            //-- 'metadata': 仅加载视频的元数据，其中包括诸如视频的持续时间和尺寸之类的信息。 有时，将通过下载几帧视频来加载元数据。
            //-- 'none': 不要预加载任何数据。 浏览器将等待，直到用户单击“播放”开始下载。
            this.mediaPlayer.preload('auto');

            //-- 设置语言
            // language: 'zh-CN'
            // 销毁videojs
            // this.mediaPlayer.dispose();
            console.log(this.mediaPlayer);
        },
        initMediaComponent: function() {
            //-- 添加播控组件容器
            if ($("#vjs_media_component").length > 0) {
                $("#vjs_media_component").html(this.options.mediaInfo.name);
            } else {
                var mediaTitle = $('<div class="vjs-media-component" id="vjs_media_component"></div>');
                $("#media_container").append(mediaTitle);
            }
            try {
                //-- 添加media播控组件
                mediaComponent.init({
                    container: "vjs_media_component",
                    mediaObj: MediaObj
                });
            } catch (e) {
                console.log(e);
            }
        },
        initFocus: function() {
            SN.add({
                id: 'media',
                selector: '#media_play.focusable',
                straightOnly: 'true',
                restrict: 'self-only',
                disabled: true
            });
            SN.makeFocusable();
        },
        //-- 设置焦点到播放器
        setFocus: function() {
            SN.enable('media');
            SN.focus("@media");
        },
        //-- 控制播放和暂停
        playToggle: function() {
            if (MediaObj.mediaPlayer.paused()) {
                MediaObj.mediaPlayer.play();
            } else {
                MediaObj.mediaPlayer.pause();
            }
        },
        initEvent: function() {
            //-- 视频监听事件
            // durationchange
            // ended -- 播放结束
            // firstplay
            // fullscreenchange
            // loadedalldata
            // loadeddata
            // loadedmetadata -- 获取资源长度完成
            // loadstart --开始请求数据
            // progress -- 正在请求数据
            // canplaythrough -- 视频源数据加载完成
            // pause -- 暂停播放
            // play -- 视频开始播放
            // playing -- 播放中
            // seeked -- 视频跳转结束
            // seeking -- 视频跳转中
            // timeupdate -- 播放时长改变
            // volumechange -- 音量改变
            // waiting -- 等待数据加载(只有在起播之后才能监听到该事件)
            // resize inherited
            // ratechange -- 播放速率改变
            // stalled -- 网速异常
            // useractive -- 用户进入活动状态
            // userinactive -- 用户进入非活动状态

            //-- 自定义错误显示方式
            this.mediaPlayer.on('error', function(e) {
                // MEDIA_ERR_ABORTED: 1 -- 媒体错误终止
                // MEDIA_ERR_CUSTOM: 0 -- 任意自定义错误
                // MEDIA_ERR_DECODE: 3 -- 视频解码错误
                // MEDIA_ERR_ENCRYPTED: 5 -- 视频源加密
                // MEDIA_ERR_NETWORK: 2 -- 网络错误
                // MEDIA_ERR_SRC_NOT_SUPPORTED: 4 -- 不支持的视频源
                var error = this.error_;
                switch (error.code) {
                    case 0:
                        break;

                    case 1:
                        break;

                    case 2:
                        new Msg({
                            content: '网络错误，无法加载',
                            confirm: function() {
                                Router.back();
                            },
                            cancle: function() {
                                Router.back();
                            }
                        })
                        break;

                    case 3:
                        new Msg({
                            content: '媒体解码错误',
                            confirm: function() {
                                Router.back();
                            },
                            cancle: function() {
                                Router.back();
                            }
                        })
                        break;

                    case 4:
                        new Msg({
                            content: '媒体资源错误',
                            confirm: function() {
                                Router.back();
                            },
                            cancle: function() {
                                Router.back();
                            }
                        })
                        break;

                    case 5:
                        break;
                }
            })

            //-- 网速异常
            this.mediaPlayer.on('stalled', function(e) {
                console.log(e);
            })

            //-- 监听视频播放中
            this.mediaPlayer.on("playing", function() {
                $('.vjs-control-bar .vjs-play-progress').removeClass('pause');
            });
            //-- 监听视频进入暂停播放(显示播控)
            this.mediaPlayer.on('pause', function(e) {
                $('.vjs-control-bar .vjs-play-progress').addClass('pause');
            });

            //-- 获取用户是否是活动状态
            // var userActive = MediaObj.mediaPlayer.userActive();
            //-- 暂停视频
            // this.mediaPlayer.pause();

            // notSupportedMessage  允许覆盖Video.js无法播放媒体源时显示的默认消息。
            // plugins 插件

            // vtt.js
            // 类型： string
            // 允许覆盖vtt.js的默认URL，该URL可以异步加载到polyfill支持WebVTT。
            // 此选项将用于Video.js（即video.novtt.js）的“novtt”版本中。否则，vtt.js与Video.js捆绑在一起。

            $('#media_play.focusable')
                .off('keydown')
                .on('keydown', function(e) {
                    console.log(e);
                    e.preventDefault();
                    e.stopPropagation();
                    var keyCode = e.keyCode;
                    if (keyCode == 27 || keyCode == 217 || keyCode == 8) {
                        SN.disable('media');
                        MediaObj.options.callback && MediaObj.options.callback.back && MediaObj.options.callback.back();
                    }
                    if (keyCode == 13) {
                        console.log('enter');
                        MediaObj.playToggle();
                    }
                    if (keyCode == 38) {
                        mediaComponent.show();
                    }
                    if (keyCode == 40) {
                        SN.disable('media');
                        MediaObj.options.callback && MediaObj.options.callback.down && MediaObj.options.callback.down();
                    }
                    if (keyCode == 37) {
                        MediaObj.updateTimeProgress('left');
                    }
                    if (keyCode == 39) {
                        MediaObj.updateTimeProgress('right');
                    }
                })
                .off('click')
                .on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    MediaObj.playToggle();
                })
        },
        showMediaComponent: function() {
            mediaComponent.show();
        },
        //-- 视频播控进度处理
        updateTimeProgress: function(type) {
            // MediaObj.timeSpacingStatus = true;
            var setevent = null;
            // setevent = setTimeout(function() {
            //     MediaObj.timeSpacingStatus = false;
            //     MediaObj.timeSpacingTotal = 0;
            // }, 1000);
            var playTimes = MediaObj.mediaPlayer.cache_;
            // 视频总时长
            var durationProgress = playTimes.duration;
            // 当前播放时长
            var currentTimeProgress = playTimes.currentTime;
            // 单次步长
            // if (MediaObj.timeSpacingStatus == true) {
            //     MediaObj.timeSpacingStatus += MediaObj.timeSpacing;
            // }
            // if (MediaObj.timeSpacing > MediaObj.maxTimeSpacing) {
            //     MediaObj.timeSpacing = MediaObj.maxTimeSpacing;
            // }
            var currentTime = null;
            // MediaObj.timeSpacingTotal += durationProgress * MediaObj.timeSpacing;
            MediaObj.timeSpacingTotal = parseInt(durationProgress * 0.1);
            if (type == 'left') {
                currentTime = parseInt(currentTimeProgress - MediaObj.timeSpacingTotal);
            } else {
                currentTime = parseInt(currentTimeProgress + MediaObj.timeSpacingTotal);
            }
            if (currentTime != null && currentTime > -1) {
                MediaObj.mediaPlayer.currentTime(currentTime);
            }
        },
        //-- keydown fun
        keydownCallback: function() {
            MediaObj.options.callback && MediaObj.options.callback.down && MediaObj.options.callback.down();
        },
        play: function() {
            this.setFocus();
            if (MediaObj.mediaPlayer.paused()) {
                MediaObj.mediaPlayer.play();
            }
        }
    };

    return MediaObj;
})