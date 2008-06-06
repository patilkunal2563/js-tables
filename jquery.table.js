/*  Usage: $(selector).table(array, options)
    Creates a table inside the first element matched by selector, displaying contents of the array of arrays
    Options:
        maxshow = number of rows to display per search
        matches = array of function(value, regexp, searchfilter) for each column. Use 0 for default
        display = array of function(value) for each column. Use 0 for default
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

    /* http://blog.stevenlevithan.com/archives/faster-trim-javascript */
    String.prototype.trim = function() { return this.replace(/^\s\s*/, "").replace(/\s\s*$/, ""); };

    $.fn.extend({
        table: function(array, options) {
            var $header,            // Header input fields
                $results,           // DIV that contains the result tables
                shown,              // Number of rows shown so far
                next,               // Next data row to search in
                lastfilter,         // Array of parameters in $header last time search was called
                re;                 // Regular expressions of lastfilter (cached)

            var header = array[0].slice(0,array[0].length),
                col = header.length,
                getval = function () { return $(this).val(); },
                matches = options && options.matches || [],      // Array of fns that match a cell
                display = options && options.display || [];      // Array of fns that show a cell
                maxshow = options && options.maxshow || 100;     // Max rows to display per

            function search(extend) {
                // Get the filters entered by the user
                var filter = $header.map(getval).get();
                var changed = !lastfilter || (lastfilter.join("") != filter.join(""));

                // Change the table only if a filter has changed
                if (changed) {
                    lastfilter = filter;
                    shown = 0;
                    next = 1;
                    re = [];
                    for (var j=0; j<col; j++) { re[j] = new RegExp(filter[j].trim(), "i"); }
                }

                if (changed || extend) {
                    var html = ["<table><tbody>"];
                    ROWS: for (var i=next, shownnow=0, li=array.length; i<li; i++) {
                        var row = array[i];

                        // Skip row if it doesn't match the filter.
                        for (var j=0; j<col; j++) {
                            if (!(matches[j] ? matches[j](row[j] || "", re[j], filter[j]) : (row[j] || "").match(re[j]))) {
                                continue ROWS;
                            }
                        }

                        // If it does, display the row.
                        html.push("<tr>");
                        for (var j=0; j<col; j++) {
                            html.push("<td class='", header[j], "'>",
                                      display[j] ? display[j](row[j] || "") : row[j] || "",
                                      "</td>");
                        }
                        html.push("</tr>");
                        shown++; shownnow++;

                        // Limit the number or rows shown each time.
                        if (shownnow >= maxshow) { break; }
                    }
                    next = i;
                    html.push("</tbody></table>");

                    if (extend) { $results.append(html.join("")); }
                    else        { $results.html  (html.join("")); }

                    // TODO: Align the widths of the columns
                }
            }

            // Force fixed layout, otherwise column alignment will go for a toss.
            var id = this.eq(0).css("table-layout", "fixed").html("");

            // Create the header.
            for (var j=0; j<col; j++) { header[j] = header[j].trim().replace(/\s/g, "_"); }
            var html = ["<table><thead>"];
            for (var row=array[0],j=0,lj=row.length; j<lj; j++) {
                html.push("<th class='", header[j], "'>", row[j], "<br/><input/></th>");
            }
            html.push("</thead></table>");
            $header = $(html.join("")).appendTo(id).find("input").css("width", "100%").keyup(function () { return search.later(200); });

            // Create the results placeholder and search
            $results = $("<div></div>").appendTo(id);
            search();

            // Scrolling will continue the search
            $(window).scroll(function(e) {
                var scrollX = window.pageYOffset || document.documentElement && document.documentElement.scrollTop    || document.body.scrollTop || 0,
                    height  = window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight || 0;
                if (scrollX + height + 100 >= id.offset().top + id.height()) { search(1); }
            });

            return this;
        }
    });
}) (jQuery);
