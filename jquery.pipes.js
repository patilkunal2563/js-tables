/*  Usage: $.getXML("http://....", function(data) {
});
*/

/*
(function($) {
    var pipes   = 'http://pipes.yahoo.com/pipes/pipe.run?_id=$id&_render=json&url=$url&_callback=?',
        getdata = function(o) { return o.data; },
        euc     = encodeURIComponent || escape;
    $.extend({
        getXML : function(url, fn) { url = pipes.replace(/\$url/, euc(url)).replace(/\$id/, 'hrDp8A0v3RGr1Dm_yZ1_DQ'          ); $.getJSON(url, function(data) { fn(data.value.items[0]);              }); },
        getHTML: function(url, fn) { url = pipes.replace(/\$url/, euc(url)).replace(/\$id/, '_sgmlzCy3BG9f_bJX0sBXw'          ); $.getJSON(url, function(data) { fn(data.value.items[0].content);      }); },
        getCSV : function(url, fn) { url = pipes.replace(/\$url/, euc(url)).replace(/\$id/, 'tjQdGky93BGl8_s0EpPZnA'          ); $.getJSON(url, function(data) { fn($.map(data.value.items, getdata)); }); },
        getFeed: function(url, fn) { url = pipes.replace(/\$url/, euc(url)).replace(/\$id/, '2d772f68598fcbd4c707a0af891e0f34'); $.getJSON(url, function(data) { fn(data.value);                       }); }
    });
})(jQuery);
*/

(function($) {
        // Note: use "where(...)" instead of "where ..." to avoid Infosys Proxy from killing it
    var yql = function(src, url) { return "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20" + src + "%20where(url%3D'" + euc(url) + "')&format=json&callback=?"; },
        euc = encodeURIComponent || escape;
    $.extend({
        getXML : function(url, fn) { $.getJSON(yql('xml' , url), function(data) { fn(data.query.results); }); },
        getHTML: function(url, fn) { $.getJSON(yql('html', url), function(data) { fn(data.query.results); }); },
        getCSV : function(url, fn) { $.getJSON(yql('csv' , url), function(data) { fn(data.query.results); }); },
        getFeed: function(url, fn) { $.getJSON(yql('rss' , url), function(data) { fn(data.query.results); }); }
    });
})(jQuery);
