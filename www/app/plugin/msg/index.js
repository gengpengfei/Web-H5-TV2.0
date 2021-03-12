//传入windwo和document对象 相当于将window和document作为了作用域中的局部变量，
//就不需要内部函数沿着作用域链再查找到最顶层的window 提高运行效率。
define(['css!./index.css'], function() {
    'use strict';
    (function(window, document) {
        var Msg = function(options) {
                this._init(options);
            }
            //定义初始化方法 并对方法传递的参数进行初始化
        Msg.prototype._init = function(option) {
                //将传入的值绑定到this上 
                this.content = option.content ? option.content : '';
                this.confirm = option.confirm ? option.confirm : null;
                this.cancle = option.cancle ? option.cancle : null;
                this.title = option.title ? option.title : null;
                this.contentStyle = option.contentStyle;
                //执行创建元素方法
                this._creatElement();
                //显示弹窗及遮罩
                this._show(this._el, this._overlay);
                //绑定事件处理函数
                this._bind(this._el, this._overlay);
            }
            //创建弹窗元素方法
        Msg.prototype._creatElement = function() {
                //创建最外层得包裹元素
                var wrap = document.createElement("div");
                wrap.className = "msg-wrap";
                //判断是否显示弹窗标题
                var headerHTML = this.title ?
                    '<div class="msg-header"><span>${this.title}</span></div>' : "";
                var footerHTML = this.confirm || this.cancle ?
                    '<div class="msg-footer"><div class="msg-footer-btn msg-active" id="m_1"><img class="cancel-button" src="/app/static/image/delete.webp"/></div><div class="msg-footer-btn" id="m_2" ><img class="confirm-button" src="/app/static/image/save.webp"/></div></div>' : "";
                //拼接完整html
                var innerHTML = headerHTML + '<div class="msg-body"><div class="msg-body-content"></div></div>' + footerHTML;
                //将拼接的html赋值到wrap中
                wrap.innerHTML = innerHTML;
                //把自定义的样式进行合并
                var contentStyle = this.contentStyle
                    //获取内容所属DOM
                var content = wrap.querySelector(".msg-body .msg-body-content");
                //将传过来的样式添加到contentDOM
                for (var key in contentStyle) {
                    if (contentStyle.hasOwnProperty(key)) {
                        content.style[key] = contentStyle[key];
                    }
                }
                //给弹窗的conntent赋值
                content.innerHTML = this.content;
                //创建遮罩层
                var overlay = document.createElement("div");
                overlay.className = "msg__overlay";
                //把dom挂载到当前实例上
                this._overlay = overlay;
                this._el = wrap;
            }
            //弹窗展现方法
        Msg.prototype._show = function(el, overlay) {
                //把弹窗的dom和遮罩插入到页面中
                document.body.appendChild(el);
                document.body.appendChild(overlay);
                //将弹窗显示出来 timeout进行异步处理显示动画
                setTimeout(function() {
                    el.style.transform = "translate(-50%,-50%) scale(1,1)";
                    overlay.style.opacity = "1";
                })
            }
            //关闭弹窗方法
        Msg.prototype._close = function(el, overlay) {
                //隐藏dom 
                el.style.transform = "translate(-50%,-50%) scale(0,0)";
                overlay.style.opcity = "0";
                //根据动画时间 动画完成再移除
                setTimeout(function() {
                    //把弹窗的dom和遮罩移除
                    document.body.removeChild(el)
                    document.body.removeChild(overlay);
                }, 300);
            }
            //事件处理函数，为DOM绑定事件
        Msg.prototype._bind = function(el, overlay) {
            //保存当前this
            //var _this = this;
            var cancle = function(e) {
                this.cancle && this.cancle.call(this, e);
                //隐藏弹窗
                this._close(el, overlay);
                //-- 移除监听
                document.removeEventListener("keydown", keydownEvent, true)
            }.bind(this);
            //确认弹窗
            var confirm = function(e) {
                this.confirm && this.confirm.call(this, e);
                this._close(el, overlay);
                //-- 移除监听
                document.removeEventListener("keydown", keydownEvent, true)
            }.bind(this);
            var keydownEvent = function(e) {
                e.stopPropagation();
                e.preventDefault();
                var checkdom = el.querySelector('.msg-active');
                //left
                if (el.querySelector("#m_1") && el.querySelector("#m_2")) {
                    if (e.keyCode == 37) {
                        checkdom.classList.remove('msg-active');
                        document.getElementById('m_1').classList.add('msg-active');
                    }
                    //right
                    if (e.keyCode == 39) {
                        checkdom.classList.remove('msg-active');
                        document.getElementById('m_2').classList.add('msg-active');
                    }
                    if (e.keyCode == 13) {
                        var id = checkdom.getAttribute('id')
                        if (id == 'm_1') cancle();
                        if (id == 'm_2') confirm();
                    }
                }
                if (e.keyCode == 147 || e.keyCode == 219 || e.keyCode == 27 || e.keyCode == 8) {
                    cancle();
                }
            }
            if (el.querySelector("#m_1")) el.querySelector("#m_1").addEventListener("mouseup", cancle);
            if (el.querySelector("#m_2")) el.querySelector("#m_2").addEventListener("mouseup", confirm);
            document.addEventListener("keydown", keydownEvent, true)
        }
        window.Msg = Msg;
    })(window, document)
})