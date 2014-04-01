
var fs = require("fs")
,   pth = require("path")
,   data = require("./consolidated.json")
,   out = []
,   ua = data.ua
,   title = "Full DOM4 test results"
,   tmpl = fs.readFileSync(pth.join(__dirname, "template.html"), "utf8")
,   totalSubtests = 0
,   uaPass = {}
;

function process (data) {
    return tmpl.replace(/\{\{(\w+)\}\}/g, function (m, p1) {
        return data[p1] !== undefined ? data[p1] : "@@@ERROR@@@";
    });
}

function cells (data) {
    var res = "";
    for (var i = 0, n = ua.length; i < n; i++) res += "<td class='" + data[ua[i]] + "'>" + data[ua[i]] + "</td>";
    return res;
}

for (var i = 0, n = ua.length; i < n; i++) uaPass[ua[i]] = 0;

for (var test in data.results) {
    var run = data.results[test];
    var result = {
        status: run.byUA
    ,   name:   test
    ,   subtests:  []
    ,   total:  0
    };
    for (var n in run.subtests) {
        result.total++;
        totalSubtests++;
        for (var i = 0, m = ua.length; i < m; i++) {
            var res = run.subtests[n].byUA[ua[i]];
            if (res === "PASS") uaPass[ua[i]]++;
        }
        result.subtests.push({ name: n, byUA: run.subtests[n].byUA });
    }
    out.push(result);
}

var table = "<thead><tr class='persist-header'><th>Test</th><th>" + ua.join("</th><th>") + "</th></tr></thead>\n"
,   toc = "<h3>Test Files</h3>\n<ol class='toc'>"
,   subtests = 0
;
for (var i = 0, n = out.length; i < n; i++) {
    var test = out[i];
    table += "<tr class='test' id='test-file-" + i + "'><td><a href='http://www.w3c-test.org" + test.name + "' target='_blank'>" +
             test.name + "</a></td>" + cells(test.status) + "</tr>\n";
    toc += "<li><a href='#test-file-" + i + "'>" + test.name + "</a></li>";
    for (var j = 0, m = test.subtests.length; j < m; j++) {
        var st = test.subtests[j];
        subtests++;
        table += "<tr class='subtest'><td>" + st.name + "</td>" + cells(st.byUA) + "</tr>\n";
    }
}
table += "</table>";
toc += "</ol>";

// XXX we need better stats

var meta = "<p><strong>Test files</strong>: " + out.length + 
           "; <strong>Total subtests</strong>: " + subtests + "</p>" +
           "<h3>Per UA</h3>\n<dl>"
;
ua.sort(function (a, b) {
    if (uaPass[a] > uaPass[b]) return -1;
    if (uaPass[a] < uaPass[b]) return 1;
    return 0;
});
for (var i = 0, n = ua.length; i < n; i++) {
    var u = ua[i];
    meta += "<dt>" + u + "</dt>\n" +
            "<dd>" + uaPass[u] + "/" + subtests + " (" + (100*uaPass[u]/subtests).toFixed(2) +"%)" + "</dd>\n";
}
meta += "</dl>";

fs.writeFileSync(
    pth.join(__dirname, "all.html")
,   process({
        title: title
    ,   table: table
    ,   meta:  meta
    ,   toc:  toc
    })
);
