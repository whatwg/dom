

var fs = require("fs")
,   pth = require("pth")
,   jsdom = require("jsdom")
,   rfs = function (f) { return fs.readFileSync(f, { encoding: "utf8" }); }
,   rel = function (f) { return pth.join(__dirname, f); }
,   error = function (e) { console.error(e); process.exit(1); }
,   localFile = rel("local-config.json") // use this file to override the config
,   localConfig = fs.existsSync(localFile) ? JSON.parse(rfs(localFile)) : {}
,   respecConfig = {
        specStatus:     "ED"
    ,   shortName:      "dom"
    ,   subtitle:       "Snapshot specification for the <a href='http://dom.spec.whatwg.org/'>DOM Living Standard</a>"
    ,   editors:        [
                            { name: "Anne van Kesteren", url: "http://annevankesteren.nl/",
                              company: "Mozilla", companyURL: "http://www.mozilla.org/",
                              email: "annevk@annevk.nl" }
                        ,   { name: "Aryeh Gregor",
                              company: "Mozilla", companyURL: "http://www.mozilla.org/",
                              email: "ayg@aryeh.name" }
                        ,   { name: "Ms2ger",
                              company: "Mozilla", companyURL: "http://www.mozilla.org/",
                              email: "ms2ger@gmail.com" }
                        ,   { name: "Alex Russell", url: "http://infrequently.org/",
                              company: "Google", companyURL: "http://www.google.com/",
                              email: "slightlyoff@chromium.org" }
                        ,   { name: "Robin Berjon", url: "http://berjon.com/",
                              company: "W3C", companyURL: "http://w3.org/",
                              email: "robin@w3.org" }
                        ]
    ,   wg:             "HTML Working Group"
    ,   wgURI:          "http://www.w3.org/html/wg/"
    ,   wgPublicList:   "public-html"
    ,   wgPatentURI:    "http://www.w3.org/2004/01/pp-impl/40318/status"
    ,   edDraftURI:     "http://darobin.github.com/html-ruby/"
    ,   license:        "cc-by"
    }
;

// make a document that can generate nice headers
for (var k in localConfig) respecConfig[k] = localConfig[k];
var respecSource = rfs(rel("header-maker.html"))
                        .replace("###CONFIG###", JSON.stringify(respecConfig, null, 4));
jsdom.env({
    html:   respecSource
,   done:   function (err, window) {
        if (err) error(err);
        console.log(window.respecEvents);
        window.respecEvents.sub("end-all", function () {
            console.log("notified of end-all");
        });
    }
});

// TODO
//  - load up dom-core.html
//  - generate the W3C headers using some local conf and ReSpec trickery
//      - add a subtitle of the kind "Snapshot version of the <a href='...'>DOM Living Standard</a>"
//      - try to make the list of editors reflect the genuine origin of the content
//      - other changes?
//  - save to index.html



