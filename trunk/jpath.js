/* Usage: XPath style Javascript object selection

    This is an implementation of the abbreviated syntax of XPath. You can't use axis::nodetest
    No functions are supported other than last()
    Only node name tests are allowed, no nodetype tests. So you can't do text() and node()
    Indices are zero-based, not 1-based

    para                        selects the para child of the context       -- not all para children of the context
    *                           selects all children of the context
    para[0]                     selects the first para child of the context -- same as /para/0
    para[last()]                selects the last para child of the context  -- same as /para/last()
    * /para                     selects all para grandchildren of the context
    /doc/chapter[5]/section[2]  same as /doc/chapter/5/section/2
    chapter//para               selects the para descendants of the chapter children of the context
    //para                      selects all the para descendants of the context
    //olist/item                selects all the item children of having an olist parent under the context
    .                           selects the context
    .//para                     selects the para element descendants of the context
    ..                          selects the parent of the context

    Not done: (and won't be unless someone asks for it)
        chapter[title] selects the chapter children of the context that have one or more title children
        chapter[title="Introduction"] selects the chapter children of the context that have one or more title children with string-value equal to Introduction

    Limitations:
        Cannot handle self-linked structures (e.g. a.x = a )
 */

var jpath = (function() {
    function _u(arr) { for (var a=arr.slice(0), i=1, l=arguments.length; i<l; i++) { a.unshift(arguments[i]); } return a; }
    function merge(a,b) { return a.push.apply(a, b); }
    function jp(obj, path, parents) {
        if (!path.length)           { return [ obj ]; }
        var id = path[0];
        if (id == "..")             { return jp(parents.shift(), path.slice(1), parents); }
        if (typeof obj != "object") { return path.length == 1 && id == "*" ? [ obj ] : []; }
        if (id == "last()")         { return obj.length ? jp(obj[obj.length-1], path.slice(1), _u(parents, obj)) : []; }
        var out = [];
        if (id !== "") { // Find children
                if (obj.hasOwnProperty(id))     { merge(out, jp(obj[id], path.slice(1), _u(parents, obj))); }
                else if (id == "*")             { for (var i in obj) { if (obj.hasOwnProperty(i)) { merge(out, jp(obj[i], path.slice(1), _u(parents, obj))); } } }
        }
        else { // Find desendants
            id = path[1];
            for (var i in obj) { if (obj.hasOwnProperty(i)) {
                if (obj[i].hasOwnProperty(id))  { merge(out, jp(obj[i][id], path.slice(2), _u(parents, obj, obj[i]))); }
                else if (id == "*" || i === id) { merge(out, jp(obj[i],     path.slice(2), _u(parents, obj        ))); }
                else                            { merge(out, jp(obj[i],     path,          _u(parents, obj        ))); }
            } }
        }
        // TODO: Remove duplicates in out
        return out;
    }

    function jpstr(obj, str) {
        if (str.charAt(0) != "/") { str = "/" + str; }  // Add leading slash if required
        var arr = str.replace(/\/+$/, "")               // Remove trailing slashes
                     .replace(/\/\/+/, "//")            // Convert /// -> //
                     .replace(/\[(\d+)\]/, "/$1")       // Convert chapter[0]/para to chapter/0/para
                     .replace(/\/(\.\/)+/g, "/").replace(/^\.\//, "/").replace(/\/\.$/, "")    // Ignore "."
                     .split("/").slice(1);

        var arr2 = [];
        for (var i=0,l=arr.length,depth=0; i<l; i++) {
            if (depth <= 0) { arr2.push(arr[i]); } else { arr2[arr2.length-1] += "/" + arr[i]; }
            var open  = arr[i].match(/\[/g);
            var close = arr[i].match(/\]/g);
            depth += (open ? open.length : 0) - (close ? close.length : 0);
        }

        return jp(obj, arr2, []);
    }

    return jpstr;
})();
