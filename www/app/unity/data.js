define(['unity/network'], function(network) {
    'use strict';
    var fun = {};

    function checkRes(res) {
        if (res.code == 100200) {
            return res.data
        }
        return [];
    }

    //-- 首页推荐
    fun.getVideoBanners = function() {
        return network({
            url: '/v1/obVideo/indexRecommend',
            type: 'POST',
        }).then(function(res) {
            return checkRes(res);
        }).catch(function(e) {
            return [{
                    "index": 2,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F260806&partner=metax',
                    "16_9": '{"img":"video/TalkingTomandFriendsSeason3horizontal.jpg"}',
                    "name": "Talking Tom Season 3",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": '0',
                    "description": 'A gray tabby cat and the title character of the franchise. Tom is a wisecracking, adventure-seeking cat, described as the "world\'s most popular cat".',
                }, {
                    "index": 5,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F256091&partner=metax',
                    "16_9": '{"img":"video/oddbodshorizontal.jpg"}',
                    "name": "Oddbods",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0",
                    "description": 'A gray tabby cat and the title character of the franchise. Tom is a wisecracking, adventure-seeking cat, described as the "world\'s most popular cat".',
                },
                {
                    "index": 3,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F260807&partner=metax',
                    "16_9": '{"img":"video/TalkingTomHeroeshorizontal.jpg"}',
                    "name": "Talking Tom Heroes",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0",
                    "description": 'A gray tabby cat and the title character of the franchise. Tom is a wisecracking, adventure-seeking cat, described as the "world\'s most popular cat".',
                },
                {
                    "index": 12,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F260808&partner=metax',
                    "16_9": '{"img":"video/talkingangelahorizontal.jpg"}',
                    "name": "Talking Angela",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0",
                    "description": 'A gray tabby cat and the title character of the franchise. Tom is a wisecracking, adventure-seeking cat, described as the "world\'s most popular cat".',
                }
            ]
        })
    }

    // 视频分类
    fun.getCategoryVideos = function(params) {
        return network({
            url: '/v1/obVideo/videoModule',
            type: 'POST',
            data: params
        }).then(function(res) {
            return checkRes(res);
        }).catch(function(e) {
            return [{
                "category_id": 8,
                "category_name": "Recommended",
                "info": [{
                    "index": 1,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F67280&partner=metax',
                    "16_9": '{"img":"video/TalkingTomShorts.jpg"}',
                    "name": "Talking Tom Shorts",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 6,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F196113&partner=metax',
                    "16_9": '{"img":"video/omnomstorieshorizontal.jpeg"}',
                    "name": "Badanamu Pop Videos",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 7,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F266003&partner=metax',
                    "16_9": '{"img":"video/Raggs.webp"}',
                    "name": "Raggs",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 8,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F263714&partner=metax',
                    "16_9": '{"img":"video/HydroandFluid.webp"}',
                    "name": "Hyrdo and Fluid",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }]
            }, {
                "category_id": 9,
                "category_name": "Cartoon",
                "info": [{
                    "index": 4,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F259085&partner=metax',
                    "16_9": '{"img":"video/omnomstorieshorizontal.jpeg"}',
                    "name": "Om Nom Stories",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 9,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F266276&partner=metax',
                    "16_9": '{"img":"video/earthtoluna.webp"}',
                    "name": "Earth to Luna",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 10,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F256788&partner=metax',
                    "16_9": '{"img":"video/luckyfred.webp"}',
                    "name": "Lucky Fred",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 11,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F264102&partner=metax',
                    "16_9": '{"img":"video/elvisandbenny.webp"}',
                    "name": "Elvis & Benny",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 13,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F112439&partner=metax',
                    "16_9": '{"img":"video/takaandmaka.webp"}',
                    "name": "Taka & Maka",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 14,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F220679&partner=metax',
                    "16_9": '{"img":"video/karl.webp"}',
                    "name": "Karl",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 15,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F257369&partner=metax',
                    "16_9": '{"img":"video/peterpanbanner.webp"}',
                    "name": "The New Adventures of Peter Pan",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 16,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F259462&partner=metax',
                    "16_9": '{"img":"video/3rabbits.webp"}',
                    "name": "3 Rabbits",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 17,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F260008&partner=metax',
                    "16_9": '{"img":"video/rat-a-tat.webp"}',
                    "name": "Rat a Tat",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 12,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F260808&partner=metax',
                    "16_9": '{"img":"video/talkingangela.webp"}',
                    "name": "Talking Angela",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 18,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F154025&partner=metax',
                    "16_9": '{"img":"video/dinostory.webp"}',
                    "name": "Dinostory",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 19,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F192021&partner=metax',
                    "16_9": '{"img":"video/howtodrawomnom.webp"}',
                    "name": "How to Draw Om Nom",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }]
            }, {
                "category_id": 9,
                "category_name": "Cartoon",
                "info": [{
                    "index": 4,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F259085&partner=metax',
                    "16_9": '{"img":"video/omnomstorieshorizontal.jpeg"}',
                    "name": "Om Nom Stories",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 9,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F266276&partner=metax',
                    "16_9": '{"img":"video/earthtoluna.webp"}',
                    "name": "Earth to Luna",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 10,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F256788&partner=metax',
                    "16_9": '{"img":"video/luckyfred.webp"}',
                    "name": "Lucky Fred",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 11,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F264102&partner=metax',
                    "16_9": '{"img":"video/elvisandbenny.webp"}',
                    "name": "Elvis & Benny",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 13,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F112439&partner=metax',
                    "16_9": '{"img":"video/takaandmaka.webp"}',
                    "name": "Taka & Maka",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 14,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F220679&partner=metax',
                    "16_9": '{"img":"video/karl.webp"}',
                    "name": "Karl",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 15,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F257369&partner=metax',
                    "16_9": '{"img":"video/peterpanbanner.webp"}',
                    "name": "The New Adventures of Peter Pan",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 16,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F259462&partner=metax',
                    "16_9": '{"img":"video/3rabbits.webp"}',
                    "name": "3 Rabbits",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 17,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F260008&partner=metax',
                    "16_9": '{"img":"video/rat-a-tat.webp"}',
                    "name": "Rat a Tat",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 12,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F260808&partner=metax',
                    "16_9": '{"img":"video/talkingangela.webp"}',
                    "name": "Talking Angela",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 18,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F154025&partner=metax',
                    "16_9": '{"img":"video/dinostory.webp"}',
                    "name": "Dinostory",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }, {
                    "index": 19,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F192021&partner=metax',
                    "16_9": '{"img":"video/howtodrawomnom.webp"}',
                    "name": "How to Draw Om Nom",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0"
                }]
            }];
        })
    }

    //-- 获取视频详情
    fun.getVideoById = function(params) {
        return network({
            url: '/v1/obVideo/videoList',
            type: 'POST',
            data: params,
        }).then(function(res) {
            return checkRes(res);
        }).catch(function(e) {
            var lists = [];
            for (var i = 0; i <= 20; i++) {
                var aa = {
                    "index": i + 1,
                    "url": '/app/plugin/media/test/PexelsVideos.mp4',
                    "16_9": '{"img":"video/TalkingTomandFriendsSeason3horizontal.jpg"}',
                    "is_vip": i > 4 ? true : false,
                    "name": "Keanu Reeves 1",
                }
                lists.push(aa)
            }
            return {
                "index": 2,
                "model": 5,
                "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F260806&partner=metax',
                "16_9": '{"img":"video/TalkingTomandFriendsSeason3horizontal.jpg"}',
                "name": "Talking Tom Season 3",
                "base_url": "",
                "type": "video",
                "direction": "1",
                "is_series": '1',
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. ",
                "plays": lists,
                "recommend": [{
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-1.jpg",
                        },
                    },
                    {
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-2.jpg",
                        },
                    },
                    {
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-3.jpg",
                        },
                    },
                    {
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-4.jpg",
                        },
                    },
                    {
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-1.jpg",
                        },
                    },
                    {
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-2.jpg",
                        },
                    },
                    {
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-3.jpg",
                        },
                    },
                    {
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-4.jpg",
                        },
                    },
                    {
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-6.jpg",
                        },
                    },
                    {
                        url: '/app/plugin/media/test/PexelsVideos.mp4',
                        "16_9": {
                            img: "/app/component/videoComponent/RecommendListDefault/image/r-1.jpg",
                        },
                    }
                ]
            };
        })
    }

    //-- 首页推荐
    fun.getVideoRecommend = function() {
        return network({
            url: '/v1/obVideo/videoRecommend',
            type: 'POST',
        }).then(function(res) {
            return checkRes(res);
        }).catch(function(e) {
            return [{
                    "index": 2,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F260806&partner=metax',
                    "16_9": '{"img":"video/TalkingTomandFriendsSeason3horizontal.jpg"}',
                    "name": "Talking Tom Season 3",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": '0',
                    "description": 'A gray tabby cat and the title character of the franchise. Tom is a wisecracking, adventure-seeking cat, described as the "world\'s most popular cat".',
                }, {
                    "index": 5,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F256091&partner=metax',
                    "16_9": '{"img":"video/oddbodshorizontal.jpg"}',
                    "name": "Oddbods",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0",
                    "description": 'A gray tabby cat and the title character of the franchise. Tom is a wisecracking, adventure-seeking cat, described as the "world\'s most popular cat".',
                },
                {
                    "index": 3,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?redirect=show%3A%2F%2F260807&partner=metax',
                    "16_9": '{"img":"video/TalkingTomHeroeshorizontal.jpg"}',
                    "name": "Talking Tom Heroes",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0",
                    "description": 'A gray tabby cat and the title character of the franchise. Tom is a wisecracking, adventure-seeking cat, described as the "world\'s most popular cat".',
                },
                {
                    "index": 12,
                    "model": 5,
                    "url": 'https://html5.toongoggles.com/?&redirect=show%3A%2F%2F260808&partner=metax',
                    "16_9": '{"img":"video/talkingangelahorizontal.jpg"}',
                    "name": "Talking Angela",
                    "base_url": "",
                    "type": "video",
                    "direction": "1",
                    "is_series": "0",
                    "description": 'A gray tabby cat and the title character of the franchise. Tom is a wisecracking, adventure-seeking cat, described as the "world\'s most popular cat".',
                }
            ]
        })
    }

    //-- 首页推荐
    fun.getVideoInfoById = function(params) {
        return network({
            url: '/v1/obVideo/videoDetail',
            data: params,
            type: 'POST',
        }).then(function(res) {
            return checkRes(res);
        }).catch(function(e) {
            return {
                "materialList": [{
                    "id": 6,
                    "title": "测试六",
                    "url": "{\"video_720\":\"1.mp4\",\"video_1080\":\"2.mp4\"}",
                    "video_img": null,
                    "sort": 0,
                    "vip": 2
                }]
            }
        })
    }
    return fun
});