/*  Usage: $(selector).table(array)
    Creates a table inside the first element matched by selector, displaying contents of the array of arrays
 */

(function($) {
    // fn.later(100, this, a,b,...) executes a this.fn(a,b,...) 100 milliseconds later
    Function.prototype.later = function() {
        var f = this,
            args = Array.prototype.slice.call(arguments),
            ms = args.shift(), obj = args.shift();
        if (f._timeout_id) { clearTimeout(f._timeout_id); }
        if (ms > 0) { f._timeout_id = setTimeout( function () { f.apply(obj, args); }, ms); }
    };

    String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };

    $.fn.extend({
        table: function(array) {
            var id = this.eq(0),
                $header, $results, html, shown, filter, next, re,
                header = array[0].slice(0,array[0].length);
                col = header.length;
            for (var j=0; j<col; j++) { header[j] = header[j].replace(/\s/g, "_"); }

            function searchlater() { return search.later(200); }    // If anyone types a new character within a few milliseconds, cancel the earlier search and use the new one.
            function getval() { return $(this).val(); }             // Gets the value of an input.

            function search(extend) {
                if (!$header) {
                    html = ["<table><thead>"];
                    for (var row=array[0],j=0,lj=row.length; j<lj; j++) { html.push("<th class='", header[j], "'>", row[j], "<br/><input/></th>"); }
                    html.push("</thead></table>");
                    id.html(html.join(""));
                    setTimeout(function() {
                        $header = id.find("table:first").find("input").keyup(searchlater).css("width", "90%");
                        $results = $("<div></div>").appendTo(id);
                        search();
                    });
                }
                else {
                    // Get the filters entered by the user
                    var params = $header.map(getval).get();
                    var changed = !filter || (filter.join("") != params.join(""));

                    // Change the table only if a filter has changed
                    if (changed) {
                        filter = params;
                        shown = 0;
                        next = 1;
                        re = [];
                        for (var j=0; j<col; j++) { re[j] = new RegExp(params[j].trim(), "i"); }
                    }

                    if (changed || extend) {
                        html = ["<table><tbody>"];
                        for (var i=next,shownnow=0,li=array.length; i<li; i++) {
                            row = array[i];

                            // Check if the row matches the filter
                            for (var j=0,skip=0; j<col; j++) { if (!(row[j] || "").match(re[j])) { skip = 1; break; } }

                            // If it does, display the row
                            if (!skip) {
                                html.push("<tr>");
                                for (var j=0; j<col; j++) { html.push("<td class='", header[j], "'>", row[j] || "", "</td>"); }
                                html.push("</tr>");
                                shown++; shownnow++;
                            }
                            if (shownnow >= 100) { break; }
                        }
                        next = i;
                        html.push("</tbody></table>");

                        if (extend) { $results.append(html.join("")); }
                        else        { $results.html  (html.join("")); }
                    }
                }
            }

            $(window).scroll(function(e) {
                var scrollX = window.pageYOffset || document.documentElement && document.documentElement.scrollTop    || document.body.scrollTop || 0,
                    height  = window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight || 0;
                if (scrollX + height > id.offset().top + id.height()) { search(1); }
            });

            id.css("table-layout", "fixed");
            search();

            return this;
        }
    });
}) (jQuery);
