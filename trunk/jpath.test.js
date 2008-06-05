// java -jar ..\rhino\js.jar test.js

load("jpath.js");

var v = { chs: { x:300, y:200 }, cht:"lc", chtt:"Title", datasets: [ { chd: "5,10,15,20,25" } ], more: [0,1,2,3,4] };

var tested = 0, failed = 0;
function test(str, val) {
    var a = jpath(v, str).join(",");
    if (a != val) { failed++; print(str + " failed: " + a + " != " + val + "\n"); }
    tested++;
}

test("chs/x", v.chs.x);
test("chs/y", v.chs.y);
test("cht",   v.cht);
test("chtt",  v.chtt);
test("datasets/0/chd", v.datasets[0].chd);

test("chs//x", v.chs.x);
test("chs//y", v.chs.y);
test("datasets//chd", v.datasets[0].chd);
test("//0/chd",  v.datasets[0].chd);

test("chs///x", v.chs.x);
test("chs////x", v.chs.x);
test("chs////x/", v.chs.x);
test("chs////x//", v.chs.x);
test("chs////x///", v.chs.x);

test("//x", v.chs.x);
test("//y", v.chs.y);
test("//chd", v.datasets[0].chd);
test("//cht",   v.cht);
test("//chtt",  v.chtt);

test("chs/x/.", v.chs.x);
test("chs/y/.", v.chs.y);
test("cht/.",   v.cht);
test("chtt/.",  v.chtt);
test("datasets/0/chd/.", v.datasets[0].chd);

test("./chs/x", v.chs.x);
test("./chs/y", v.chs.y);
test("./cht",   v.cht);
test("./chtt",  v.chtt);
test("./datasets/0/chd", v.datasets[0].chd);

test("./chs/./x", v.chs.x);
test("./chs/./y", v.chs.y);
test("./cht/.",   v.cht);
test("./chtt/.",  v.chtt);
test("./datasets/./0/chd", v.datasets[0].chd);

test("./chs/./x/./", v.chs.x);
test("./chs/./y/./", v.chs.y);
test("./cht/./",   v.cht);
test("./chtt/./",  v.chtt);
test("./datasets/./0/chd/./", v.datasets[0].chd);

test("chs//./x", v.chs.x);
test("chs//./y", v.chs.y);
test("datasets//./chd", v.datasets[0].chd);

test("//x/../y", v.chs.y);
test("//x/../../chtt", v.chtt);

test("//./x", v.chs.x);
test("//./y", v.chs.y);
test("//./chd", v.datasets[0].chd);
test("//./cht",   v.cht);
test("//./chtt",  v.chtt);

test("/chs/x/../y",  v.chs.y);
test("/chs/x/../../chtt",  v.chtt);
test("//chd/../..//chd",  v.datasets[0].chd);
test("/chs/x/../y/../../cht/../chtt/../datasets/0/chd",  v.datasets[0].chd);
test("/chs/*",  [v.chs.x, v.chs.y].join(","));
test("/chs/*/../x",  [v.chs.x, v.chs.x].join(","));
test("/datasets/last()/chd", v.datasets[0].chd);
test("/more/last()", v.more[v.more.length-1]);

test("//chs/nothing/..", "");
test("././cht", v.cht);

/* Dynamic tests */
function $map(arr, fn) {
    for (var out=[], i=0, l=arr.length; i<l; i++) {
        out[i] = fn(arr[i], i);
    }
    return out;
}
function randomtest(stack, object, parents) {
    while (1) {
        var r = Math.random(), key;
        if (typeof object == "object") {
            var arr = [];
            for (var i in object) { if (object.hasOwnProperty(i)) { arr.push(i); } }
            key = arr[Math.floor(Math.random() * arr.length)];
        }
        if (r < 0.05) { stack.push("."); return randomtest(stack, object, parents); }
        if (r < 0.15) { if ((typeof object).match(/number|string|boolean/)) { return object; } }
        if (r < 0.25) { if (parents.length > 0)        { stack.push("..");                              return randomtest(stack, parents.shift(), parents); } }
        if (r < 0.75) { if (typeof object == "object") { stack.push(key);      parents.unshift(object); return randomtest(stack, object[key], parents);     } }
        if (r < 0.95) { if (object instanceof Array)   { stack.push("last()"); parents.unshift(object); return randomtest(stack, object[object.length-1], parents); } }
        // Need to test *
    }
}


// load("D:/code/jslib/rsh/json.js");
for (var i=0; i<1000; i++) {
    var stack = [];
    var out = randomtest(stack, v, []);
    test(stack.join("/"), out);
}

if (!failed) { print("OK. Passed " + tested + " tests."); }
else { print(failed + " failed tests out of " + tested); }
