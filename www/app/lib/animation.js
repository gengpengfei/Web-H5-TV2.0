define(['jquery'], function($) {
    $.fn.ensureVertical = function(container, callback) {
        //-- 最小偏移量
        var _gap = 10;

        var $this = $(this).first();
        var $container = container.first();

        //-- 当前容器的高度
        var _height_c = $container.height();
        //-- 获取当前元素的绝对X,Y坐标
        var _position_f = $this.offset();
        //-- 获取容器的绝对X,Y坐标
        var _position_c = $container.offset();
        //-- 当前焦点距离容器的top
        var positionTop = _position_f.top - _position_c.top;
        //-- 当前元素的height 
        var _height_f = $this.outerHeight(true);

        var newPosition = null;
        //-- 向下时焦点应该距离容器顶部的距离
        var _down_h = (_height_c - _height_f) / 2;
        //-- 向上时焦点应该距离容器顶部的距离
        var _up_h = (_height_c - _height_f) / 2;

        var _transform = $container.children().first().css("transform");
        var _scrollTop = _transform == 'none' ? 0 : parseInt(_transform.split(/[, ]+/g)[5]);

        if (positionTop - _down_h > _gap) {
            newPosition = _scrollTop - positionTop + _down_h;
        } else if (_up_h - positionTop > _gap) {
            newPosition = _scrollTop - positionTop + _up_h;
        }

        if (newPosition) {
            //-- 获取滚动容器的总高度
            var scrollHeight = $container.children().first().height();
            newPosition = -newPosition > scrollHeight - _height_c ? _height_c - scrollHeight : newPosition;
            newPosition = newPosition > 0 ? 0 : newPosition;
            $container.children().first().css("transform", "translateY(" + newPosition + "px)");
            setTimeout(callback.bind(this));
        } else {
            setTimeout(callback.bind(this))
        }

        return this;
    };
    $.fn.ensureVerticalByTopAndBottom = function($container, callback, top, bottom) {
        //-- 最小偏移量
        var _gap = 10;
        var $this = $(this);

        //-- 获取当前元素的绝对X,Y坐标
        var _position_f = $this.offset();
        //-- 获取容器的绝对X,Y坐标
        var _position_c = $container.offset();
        //-- 当前焦点距离容器的top
        var positionTop = _position_f.top - _position_c.top;

        var newPosition = null;
        //-- 向下时焦点应该距离容器顶部的距离
        var _down_h = top || 0;
        //-- 向上时焦点应该距离容器顶部的距离
        var _up_h = bottom || 0;

        var _transform = $container.children().first().css("transform");
        var _scrollTop = _transform == 'none' ? 0 : parseInt(_transform.split(/[, ]+/g)[5]);

        if (positionTop - _down_h > _gap) {
            newPosition = _scrollTop - positionTop + _down_h;
        } else if (_up_h - positionTop > _gap) {
            newPosition = _scrollTop - positionTop + _up_h;
        }
        if (newPosition) {
            newPosition = newPosition > 0 ? 0 : newPosition;
            $container.children().first().css("transform", "translateY(" + newPosition + "px)");
            setTimeout(callback.bind(this));
        } else {
            setTimeout(callback.bind(this))
        }

        return this;
    };
    $.fn.ensureHorizontal = function(container, callback) {
        //-- 最小偏移量
        var _gap = 10;

        var $this = $(this).first();
        var $container = container.first();

        //-- 获取当前元素的绝对X,Y坐标
        var _position_f = $this.offset();
        //-- 获取容器的绝对X,Y坐标
        var _position_c = $container.offset();
        //-- 当前焦点距离容器的left
        var positionLeft = _position_f.left - _position_c.left;
        //-- 当前元素的width
        var _width_f = $this.outerWidth(true);

        var newPosition = null;
        //-- 左右移动时焦点应该距离容器left的距离
        var _left_l = ($container.outerWidth() - $this.outerWidth()) / 2;

        var _scrollDom = $container.children().first();
        //-- 总宽度
        var _scroll_w = _scrollDom.width();

        //--  移动距离
        var _transform = _scrollDom.css("transform");
        var _scrollLeft = _transform == 'none' ? 0 : parseInt(_transform.split(/[, ]+/g)[4]);
        newPosition = _scrollLeft - positionLeft + _left_l;
        //-- 本次需要移动的距离
        var _n_p = Math.abs(newPosition - _scrollLeft);

        if (newPosition && _n_p > _gap) {
            //-- 移动到最左边时，重置为0，不移动
            if (newPosition > 0) {
                newPosition = 0;
            } else {
                //-- 移动到最右边时，重置为最大宽度，不移动
                if (newPosition + _scroll_w < $container.outerWidth() && _scroll_w + _scrollLeft - _width_f < $container.outerWidth()) {
                    newPosition = $container.outerWidth() - _scroll_w;
                }
            }

            $container.children().first().css("transform", "translateX(" + newPosition + "px)");
            setTimeout(callback.bind(this));
        } else {
            setTimeout(callback.bind(this))
        }
        return this;
    };
    $.fn.ensureHorizontalByIndex = function(container, index, callback) {
        var $container = container.first();
        var $this = $(this).first();
        //-- 滚动视图
        var _scrollDom = $container.children().first();
        //-- 总宽度
        var _scroll_w = _scrollDom.width();
        var newPosition = -$this.outerWidth(true) * (index - 3);
        if (newPosition) {
            //-- 移动到最左边时，重置为0，不移动
            if (newPosition > 0 || _scroll_w < $container.outerWidth()) {
                newPosition = 0;
            } else {
                //-- 移动到最右边时，重置为最大宽度，不移动
                if (newPosition + _scroll_w < $container.outerWidth()) {
                    newPosition = $container.outerWidth() - _scroll_w;
                }
            }
            //-- 左右滚动需要判断rtl镜像
            if (window.rtl) newPosition = -newPosition;

            $container.children().first().css("transform", "translateX(" + newPosition + "px)");
            setTimeout(callback.bind(this));
        } else {
            setTimeout(callback.bind(this))
        }
        return this;
    };
})