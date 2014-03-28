
var fs = require("fs")
,   pth = require("path")
,   data = require("./consolidated.json")
,   out = []
,   ua = data.ua
;

for (var test in data.results) {
    var run = data.results[test];
    var result = {
        status: run.byUA
    ,   name:   test
    ,   fails:  []
    };
    for (var name in run.subtests)
        if (run.subtests[name].totals.PASS < 2) result.fails.push({ name: name, byUA: run.subtests[name].byUA });
    if (result.fails.length) out.push(result);
}

// open up generic template
// generate output table
// interpolate in template
// output less-than-2.html
