
var fs = require("fs")
,   pth = require("path")
,   data = {}
,   out = {
        ua: []
    ,   results: {}
    }
;

fs.readdirSync(__dirname)
    .forEach(function (f) {
        if (/\.json$/.test(f)) return;
        data[f.replace(/\.json$/, "")] = JSON.parse(fs.readFileSync(pth.join(__dirname, f), "utf8"));
    });

for (var ua in data) {
    out.ua.push(ua);
    for (var i = 0, n = data[ua].results.length; i < n; i++) {
        var testData = data[ua].results[i]
        ,   id = testData.test
        ;
        if (!out[id]) {
            out[id] = {
                byUA:       {}
            ,   totals:     {}
            ,   subtests:   {}
            };
        }
        out[id].byUA[ua] = testData.status;
        if (!out[id].totals[testData.status]) out[id].totals[testData.status] = 1;
        else out[id].totals[testData.status]++;
        for (var j = 0, m = testData.subtests.length; j < m; j++) {
            var st = testData.subtests[j];
            if (!out[id].subtests[st.name]) out[id].subtests[st.name] = { byUA: {}, totals: {} };
            out[id].subtests[st.name].byUA[ua] = st.status;
            if (!out[id].subtests[st.name].totals[st.status]) out[id].subtests[st.name].totals[st.status] = 1;
            else out[id].subtests[st.name].totals[st.status]++;
        }
    }
}

fs.writeFileSync(pth.join(__dirname, "consolidated.json"), JSON.stringify(out, null, 2), { encoding: "utf8"});
