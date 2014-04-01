
var fs = require("fs")
,   pth = require("path")
,   data = require("./consolidated.json")
,   out = []
,   ua = data.ua
,   title = "Features with fewer than 2 passes"
,   tmpl = fs.readFileSync(pth.join(__dirname, "template.html"), "utf8")
,   totalSubtests = 0
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

for (var test in data.results) {
    var run = data.results[test];
    var result = {
        status: run.byUA
    ,   name:   test
    ,   fails:  []
    ,   total:  0
    };
    for (var n in run.subtests) {
        result.total++;
        totalSubtests++;
        if (!run.subtests[n].totals.PASS || run.subtests[n].totals.PASS < 2) result.fails.push({ name: n, byUA: run.subtests[n].byUA });
    }
    if (result.fails.length) out.push(result);
}

var table = "<thead><tr class='persist-header'><th>Test</th><th>" + ua.join("</th><th>") + "</th></tr></thead>\n"
,   toc = "<h3>Test Files</h3>\n<ol class='toc'>"
,   fails = 0
;
for (var i = 0, n = out.length; i < n; i++) {
    var test = out[i]
    ,   details = "<small>(" + test.fails.length + "/" + test.total + ", " +
                 (100*test.fails.length/test.total).toFixed(2) + "%, " +
                 (100*test.fails.length/totalSubtests).toFixed(2) + "% of total)</small>"
    ;
    table += "<tr class='test' id='test-file-" + i + "'><td><a href='http://www.w3c-test.org" + test.name + "' target='_blank'>" +
             test.name + "</a> " + details + "</td>" + cells(test.status) + "</tr>\n";
    toc += "<li><a href='#test-file-" + i + "'>" + test.name + "</a> " + details + "</li>";
    for (var j = 0, m = test.fails.length; j < m; j++) {
        var st = test.fails[j];
        fails++;
        table += "<tr class='subtest'><td>" + st.name + "</td>" + cells(st.byUA) + "</tr>\n";
    }
}
table += "</table>";
toc += "</ol>";

var meta = "<p><strong>Test files with failures</strong>: " + out.length +
           "; <strong>Subtests with fewer than 2 passes: </strong>" + fails +
           "; <strong>Failure level</strong>: " + fails + "/" + totalSubtests + " (" +
           (100*fails/totalSubtests).toFixed(2) + "%)</p>"
;

fs.writeFileSync(
    pth.join(__dirname, "less-than-2.html")
,   process({
        title: title
    ,   table: table
    ,   meta:  meta
    ,   toc:  toc
    })
);
