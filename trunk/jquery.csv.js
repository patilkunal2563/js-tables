/* Usage:
 *  jQuery.csv()(csvtext)               returns an array of arrays representing the CSV text.
 *  jQuery.csv("\t")(tsvtext)           uses Tab as a delimiter (comma is the default)
 *  jQuery.csv("\t", "'")(tsvtext)      uses single quotes as the quote character (double quotes is the default)
 *  jQuery.csv("\t", "'\"")(tsvtext)    uses single & double quotes as the quote character
 *  Note: Use jQuery.csv(delim, 0) to speed up loading, if there are no quotes. Use with care: there might be quotes
 *
 *  Required split() to work properly.
 */

jQuery.extend({
    csv: function(delim, quote, lined) {
        delim = typeof delim == "undefined" ? ','    : delim;
        quote = typeof quote == "undefined" ? '"'    : quote;
        lined = typeof lined == "undefined" ? "\r\n" : lined;

        var delimre = new RegExp( "[" + delim + "]" ),
            quotere = new RegExp("^[" + quote + "]" ),
            linedre = new RegExp( "[" + lined + "]+"),
            quotes  = quote ? quote.split("") : [],
            doublequotere = {};
        for (var i=0; q=quotes[i]; i++) { doublequotere[q] = new RegExp(q + q, "g"); }

        function splitline (v) {
            // Split the line using the delimitor
            var arr  = v.split(delimre);
            if (quote) {
                for (var out=[], q, i=0, l=arr.length; i<l; i++) {
                    if (q = arr[i].match(quotere)) {
                        q = q[0];
                        for (var j=i; j<l; j++) {
                            if (arr[j].charAt(arr[j].length-1) == q) { break; }
                        }
                        var s = arr.slice(i,j+1).join(delim).replace(doublequotere[q], q);
                        out.push(s.substr(1,s.length-2));
                        i = j;
                    }
                    else {
                        out.push(arr[i]);
                    }
                }
                return out;
            } else {
                return arr;
            }
        }

        return function(text) {
            var lines = text.split(linedre);
            for (var i=0, l=lines.length; i<l; i++) {
                lines[i] = splitline(lines[i]);
            }
            return lines;
        };
    }
});
