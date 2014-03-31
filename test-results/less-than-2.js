
var fs = require("fs")
,   pth = require("path")
,   data = require("./consolidated.json")
,   out = []
,   ua = data.ua
,   title = "Features with fewer than 2 passes"
,   tmpl = fs.readFileSync(pth.join(__dirname, "template.html"), "utf8")
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
    };
    for (var n in run.subtests)
        if (!run.subtests[n].totals.PASS || run.subtests[n].totals.PASS < 2) result.fails.push({ name: n, byUA: run.subtests[n].byUA });
    if (result.fails.length) out.push(result);
}

var table = "<thead><tr class='persist-header'><th>Test</th><th>" + ua.join("</th><th>") + "</th></tr></thead>\n"
,   fails = 0
;
for (var i = 0, n = out.length; i < n; i++) {
    var test = out[i];
    table += "<tr class='test'><td><a href='" + test.name + "' target='_blank'>" + test.name + "</a></td>" + cells(test.status) + "</tr>\n";
    for (var j = 0, m = test.fails.length; j < m; j++) {
        var st = test.fails[j];
        fails++;
        table += "<tr class='subtest'><td>" + st.name + "</td>" + cells(st.byUA) + "</tr>\n";
    }
}

var meta = "<strong>Test files with failures</strong>: " + out.length +
           "; <strong>Subtests with more than 2 failures: </strong>" + fails;

fs.writeFileSync(
    pth.join(__dirname, "less-than-2.html")
,   process({
        title: title
    ,   table: table
    ,   meta:  meta
    })
);
