/* Usage:
    aws({
        Operation:      'ItemSearch',
        SearchIndex:    'Books',
        ResponseGroup:  'ItemAttributes,Similarities',
        Keywords:       'Harry Potter',
        Sort:           'salesrank'
    }, function(data) { console.log(data); })

    Requires jquery.pipes.js for $.getXML()
*/

(function($) {
    var endpoints = {
        'US': 'ecs.amazonaws.com',
        'UK': 'ecs.amazonaws.co.uk',
        'JP': 'aws.amazonaws.jp',
        'FR': 'aws.amazonaws.fr',
        'DE': 'aws.amazonaws.de',
        'CA': 'aws.amazonaws.ca'
    },
    secure = 0,
    euc = (encodeURIComponent || escape);

    $.extend({
        AWS: function(country, accesskey, associatetag) {
            var base = secure ? 'https://' : 'http://'
                 + (endpoints[country] || endpoints.US)
                 + '/onca/xml?Service=AWSECommerceService'
                 + "&AWSAccessKeyId=" + accesskey
                 + "&AssociateTag" + associatetag;

            // Windows CP-1252 non-ISO-8859-1 characters
            var cp1252 = {
                    "\x80" : "\u20AC",	// EURO SIGN
                    "\x82" : "\u201A",	// SINGLE LOW-9 QUOTATION MARK
                    "\x83" : "\u0192",	// LATIN SMALL LETTER F WITH HOOK
                    "\x84" : "\u201E",	// DOUBLE LOW-9 QUOTATION MARK
                    "\x85" : "\u2026",	// HORIZONTAL ELLIPSIS
                    "\x86" : "\u2020",	// DAGGER
                    "\x87" : "\u2021",	// DOUBLE DAGGER
                    "\x88" : "\u02C6",	// MODIFIER LETTER CIRCUMFLEX ACCENT
                    "\x89" : "\u2030",	// PER MILLE SIGN
                    "\x8A" : "\u0160",	// LATIN CAPITAL LETTER S WITH CARON
                    "\x8B" : "\u2039",	// SINGLE LEFT-POINTING ANGLE QUOTATION MARK
                    "\x8C" : "\u0152",	// LATIN CAPITAL LIGATURE OE
                    "\x8E" : "\u017D",	// LATIN CAPITAL LETTER Z WITH CARON
                    "\x91" : "\u2018",	// LEFT SINGLE QUOTATION MARK
                    "\x92" : "\u2019",	// RIGHT SINGLE QUOTATION MARK
                    "\x93" : "\u201C",	// LEFT DOUBLE QUOTATION MARK
                    "\x94" : "\u201D",	// RIGHT DOUBLE QUOTATION MARK
                    "\x95" : "\u2022",	// BULLET
                    "\x96" : "\u2013",	// EN DASH
                    "\x97" : "\u2014",	// EM DASH
                    "\x98" : "\u02DC",	// SMALL TILDE
                    "\x99" : "\u2122",	// TRADE MARK SIGN
                    "\x9A" : "\u0161",	// LATIN SMALL LETTER S WITH CARON
                    "\x9B" : "\u203A",	// SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
                    "\x9C" : "\u0153",	// LATIN SMALL LIGATURE OE
                    "\x9E" : "\u017E",	// LATIN SMALL LETTER Z WITH CARON
                    "\x9F" : "\u0178"	// LATIN CAPITAL LETTER Y WITH DIAERESIS
            };

            var cache = {};

            // AWS ECS returns data that is sometimes double-UTF8 encoded, sometimes CP1252 encoded. So adjust.
            // UTF8 decode snippet from http://localhost/amazon-browser.html#Related:032147404X
            // CP1252 conversion from
            function decode_aws(data) {
                var t = typeof data;
                if (t == "object") { for (var i in data) { if (data.hasOwnProperty(i)) { data[i] = decode_aws(data[i]); } } }
                else if (t == "string") {
                    try { data = decodeURIComponent(escape(data)); } catch(e) { }
                    data = data.replace(/([\x80-\x9F])/g, function(str, c) { return cp1252[c]; });
                }
                return data;
            }

            return function(params, callback) {
                var url = [];
                for (var key in params) { if (params.hasOwnProperty(key)) {
                    // url.push(euc(key) + "=" + euc(params[key]));
                    url.push(key + "=" + params[key]);
                } }

                url = base + '&' + url.sort().join('&');
                if (cache[url]) { setTimeout(function() { callback(cache[url]); }, 0); }
                else {
                    $.getXML(url, function(data) {
                        for (var key in data) { data = data[key]; break; }
                        cache[url] = decode_aws(data);
                        callback(cache[url]);
                    });
                }
            };
        }
    });
})(jQuery);
