/* 主页背景色 */

.container {
    background-color: rgba(37, 43, 58, 1);
}


/* 非焦点默认色 */

.THEME-FOCUS-DEFAULT {
    background-color: #5B5E75;
}


/* 焦点颜色 */

.THEME-FOCUS-ACTIVE {
    background-color: rgba(102, 51, 255);
}


/* 默认字体颜色 */

.THEME-COLOR-DEFAULT {
    /* color: rgba(225, 225, 225); */
    color: #EEEEEE;
}


/* 焦点字体颜色 */

.THEME-COLOR-FOCUS {
    color: rgba(102, 51, 255);
}


/* 行间隔，使用底部margin */

.MARGIN-BUTTOM {
    margin-bottom: 4vh;
}

.FONT-LARGE {
    font-size: 4.5vh;
}

.FONT-MEDIUM {
    font-size: 3vh;
}

.FONT-SMALL {
    font-size: 2.5vh;
}


/* 一行一个元素 */

.WIDTH-1 {
    width: 100%;
}


/* 一行两个元素 */

.WIDTH-2 {
    width: 45%;
}


/* 一行三个元素 */

.WIDTH-3 {
    width: 28.5vw;
}


/* 一行四个元素 */

.WIDTH-4 {
    width: 23%
}


/* 一行五个元素 */

.WIDTH-5 {
    width: 16vw;
}

.GAP-COL {
    width: 4vh;
    height: auto;
}


/* 内容分类title */

.category-title {
    height: 10vh;
    width: 100%;
}

.category-title .title {
    padding: 0 1vw;
    line-height: 10vh;
    font-weight: 500;
    color: rgba(225, 225, 225);
}


/* 内容焦点样式 */

.content-common {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 0.8vh;
    background: url('image/content-default.webp') rgba(65, 65, 75, 0.5) no-repeat;
    background-repeat: no-repeat;
    background-size: auto 30%;
    background-position: center;
    overflow: hidden;
}

.content-common div {
    pointer-events: none;
}

.content-common img {
    pointer-events: none;
}

.content-common .item-img {
    width: 100%;
    height: 100%;
    position: absolute;
    border: none;
    left: 0;
    top: 0;
    border-radius: 0.8vh;
    overflow: hidden;
}

.content-common.focusable {
    transform: perspective(1px) scale(1) translateZ(0);
    transition-duration: 0s;
    transition-timing-function: ease-out;
}

.content-common.focusable:focus {
    transform: perspective(1px) scale(1) translateZ(0);
    -webkit-backface-visibility: hidden;
}

.content-common.focusable:focus .item-img:nth-of-type(2) {
    transition: transform 0s linear;
    transform: translateX(1.5vh) translateY(-1.5vh) translateZ(0) scale(1)
}

.content-common.focusable.active {
    transform: scale(1) translateZ(0);
}

.content-common.focusable::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: -150%;
    overflow: hidden;
    background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0)0, rgba(255, 255, 255, .2)50%, rgba(255, 255, 255, 0)100%);
    -webkit-transform: skewX(-25deg);
    z-index: 999;
}

.content-common.focusable:focus::before {
    left: 150%;
    transition: left 0.4s linear 0.6s;
}

.content-common.focusable::after {
    content: "";
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
    border-radius: 0.8vh;
    border: 0.7vh solid hsla(0, 0%, 100%, 0);
    transition: border 0s ease-out 0s;
}

.content-common.focusable:focus::after {
    border: 0.7vh solid hsla(0, 0%, 100%, 1);
}


/* header theme */

.header .message:focus {
    background-color: #ff9f0a;
}


/* 横向渐变 */

div[dir="rtl"] .horizontal-background {
    background: -webkit-gradient(linear, 100% 0, 0 0, from(#000), to(rgba(0, 0, 0, 0))) !important;
}

.horizontal-background {
    background: -webkit-gradient(linear, 0 0, 80% 0%, from(#000), to(rgba(0, 0, 0, 0)));
}


/* 纵向渐变 */

.vertical-background {
    background: -webkit-gradient(linear, 0% 99%, 0% 70%, from(#000), to(rgba(0, 0, 0, 0)));
}

/* 首屏banner 动画*/
.videobanner-bg-list .videobanner-item {
    opacity: 0;
    transition: opacity 0s ease-in;
}

/*首屏分类页显示动画*/
.videorecommend-container{
    transition: top 0s ease-out, background 0s linear;
} 

/*首屏分类页滚动动画*/
.videorecommend-container .scrollPage {
    transform: translateY(0);
    transition-duration: 0s;
    transition-timing-function: ease-out;
}

/*视频分类详情页动画*/ 
.video-module .scrollPage{
    transform: translateY(0);
    transition-duration: 0s;
    transition-timing-function: ease-out;
}

/*视频详情页选集/推荐滚动动画*/ 
.video-pro-rec-container .scrollPage {
    transform: translateY(0);
    transition-duration: 0s;
    transition-timing-function: ease-out;
}