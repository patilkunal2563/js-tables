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
        delim = typeof delim == "undefined" ? ','    : delim;   // delimiter is comma by default
        quote = typeof quote == "undefined" ? '"'    : quote;   // quotes mark is "double quotes" by default
        lined = typeof lined == "undefined" ? "\r\n" : lined;   // line delimiter is \r or \n or both

        // Create regular expressions for everything to speed up usage later on
        var delimre = new RegExp( "[" + delim + "]" ),
            quotere = new RegExp("^[" + quote + "]" ),
            linedre = new RegExp( "[" + lined + "]+"),
            quotes  = quote ? quote.split("") : [],
            doublequotere = {};
        for (var i=0; q=quotes[i]; i++) { doublequotere[q] = new RegExp(q + q, "g"); }

        // Splits a line using the delimitor and returns an array
        function splitline (v) {
            // split() doesn't work properly on IE. "a,,b".split(",") returns ["a", "b"] and not ["a", "", "b"]
            // You need to fix String.prototype.split first. See http://blog.stevenlevithan.com/archives/cross-browser-split
            var arr  = v.split(delimre);

            // If we have quotes and there were delimitors within the quotes, handle those
            if (quote) {
                for (var out=[], q, i=0, l=arr.length; i<l; i++) {
                    // If the value is within quotes, then from the point where the quote begins ...
                    if (q = arr[i].match(quotere)) {
                        q = q[0];
                        // ... to the point where the quote ends
                        for (var j=i; j<l; j++) {
                            if (arr[j].charAt(arr[j].length-1) == q) { break; }
                        }

                        // Join the pieces into a single piece
                        var s = arr.slice(i,j+1).join(delim);

                        // Double quoting is the escape sequence for quotes. ("" instead of ")
                        s = s.replace(doublequotere[q], q);

                        // Use this joined piece instead of the individual pieces
                        out.push(s.substr(1,s.length-2));
                        i = j;
                    }
                    else {
                        out.push(arr[i]);
                    }
                }
                return out;
            }

            return arr;
        }

        // The main function. Split into lines, and then call splitline repeatedly.
        return function(text) {
            var lines = text.split(linedre);
            for (var i=0, l=lines.length; i<l; i++) {
                lines[i] = splitline(lines[i]);
            }
            return lines;
        };
    }
});
