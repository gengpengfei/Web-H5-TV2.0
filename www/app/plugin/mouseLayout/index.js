define([
    'jquery',
    'navigation',
    'text!./index.html',
    'css!./index.css',
], function($, SN, view) {
    'use strict';
    var interval = 700;
    var setIntervalEvent;

    $("#container").append(view);

    $(".mouse-up")
        .off('mouseenter')
        .on('mouseenter', function(e) {
            setIntervalEvent = setInterval(function() {
                SN.move('up')
            }, interval);
        })
        .off('mouseout')
        .on('mouseout', function() {
            clearInterval(setIntervalEvent)
        })

    $(".mouse-down")
        .off('mouseenter')
        .on('mouseenter', function(e) {
            setIntervalEvent = setInterval(function() {
                SN.move('down')
            }, interval);
        })
        .off('mouseout')
        .on('mouseout', function() {
            clearInterval(setIntervalEvent)
        })

    $(".mouse-left")
        .off('mouseenter')
        .on('mouseenter', function(e) {
            setIntervalEvent = setInterval(function() {
                SN.move('left')
            }, interval);
        })
        .off('mouseout')
        .on('mouseout', function() {
            clearInterval(setIntervalEvent)
        })

    $(".mouse-right")
        .off('mouseenter')
        .on('mouseenter', function(e) {
            setIntervalEvent = setInterval(function() {
                SN.move('right')
            }, interval);
        })
        .off('mouseout')
        .on('mouseout', function() {
            clearInterval(setIntervalEvent)
        })

    $("#container")
        .off('mousewheel')
        .on('mousewheel', function(e) {
            if (e.originalEvent.deltaY > 0) {
                SN.move('down')
            } else {
                SN.move('up')
            }
        })
});