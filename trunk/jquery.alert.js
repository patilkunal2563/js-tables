/*  Transparent alerts
    By S Anand <http://www.s-anand.net/>
    Licensed under the WTFPL (http://sam.zoy.org/wtfpl/)
    http://js-tables.googlecode.com/

    Usage: jQuery.alert("Hello world");
    Adds message to a queued non-modal transparent alert that stays until the mouse is moved.
 */

(function($){

$.alert = (function() {
    // ---- Begin configration ----
    var hideDelay        = 1000,    // Alerts will stay on screen for at least this many milliseconds
        slideUpDelay     = 300,     // Alerts will be hidden with a slide-up animation that lasts this many milliseconds
        slideDownDelay   = 300,     // Alerts will be shown with a slide-down animation that lasts this many milliseconds
        // CSS for the box that contains all the alerts
        messageBoxCSS = {
            'top': '-4px',
            'width': '50%',
            'margin': '0 25%',
            'padding': '0 5px',
            'position': 'fixed',
            'border-color': '#777',
            'border-style': 'solid',
            'border-width': '0 4px 4px',
            'background': 'rgb(255,255,255)',
            'background': 'rgba(255,255,255,0.75)',
            'border-radius-bottomleft': '20px',
            'border-radius-bottomright': '20px',
            '-moz-border-radius-bottomleft': '20px',
            '-moz-border-radius-bottomright': '20px',
            '-webkit-border-bottom-left-radius': '20px',
            '-webkit-border-bottom-right-radius': '20px'
        },
        // CSS for the alert itself
        messageCSS = {
            'background': '#f3da86',
            'margin': '2px 0 5px 0',
            'padding': '2px 10px',
            'border-radius': '20px',
            'text-align': 'center',
            'font': '24px Garamond',
            '-moz-border-radius': '20px',
            '-webkit-border-radius': '20px'
        };

    // ---- End configration. Begin code ----
    var message = $('<div></div>').appendTo('body').css(messageBoxCSS),
        hideTimer = 0;
    $('body').mousemove(function() {
        if (!hideTimer) {
            hideTimer = setTimeout(function() {
                message.stop(true, true).slideUp(slideUpDelay);
            }, hideDelay)
        }
    });
    return function(text) {
        message.stop(true, true).show();
        clearTimeout(hideTimer);
        $('<p>').css(messageCSS).html('' + text).prependTo(message).hide().slideDown(slideDownDelay, function() { hideTimer = 0; });
        $('p:gt(2)', message).hide();
        $('p:eq(1)', message).css('opacity', '0.6');
        $('p:eq(2)', message).css('opacity', '0.3');
    };
})();

})(jQuery);