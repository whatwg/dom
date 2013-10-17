

var fs = require("fs")
,   pth = require("path")
,   jsdom = require("jsdom")
,   rfs = function (f) { return fs.readFileSync(f, { encoding: "utf8" }); }
,   rel = function (f) { return pth.join(__dirname, f); }
,   error = function (e) { console.error(e); process.exit(1); }
,   localFile = rel("local-config.json") // use this file to override the config
,   localConfig = fs.existsSync(localFile) ? JSON.parse(rfs(localFile)) : {}
,   respecConfig = {
        specStatus:     "ED"
    ,   shortName:      "dom"
    ,   subtitle:       "XXX"
    ,   noReSpecCSS:    true
    ,   editors:        [
                            { name: "Anne van Kesteren", url: "http://annevankesteren.nl/",
                              company: "Mozilla", companyURL: "http://www.mozilla.org/",
                              email: "annevk@annevk.nl", note: "Upstream WHATWG version" }
                        ,   { name: "Aryeh Gregor",
                              company: "Mozilla", companyURL: "http://www.mozilla.org/",
                              email: "ayg@aryeh.name", note: "Upstream WHATWG version" }
                        ,   { name: "Ms2ger",
                              company: "Mozilla", companyURL: "http://www.mozilla.org/",
                              email: "ms2ger@gmail.com", note: "Upstream WHATWG version" }
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
    ,   edDraftURI:     "http://w3c.github.io/dom/"
    ,   license:        "cc-by"
    }
;

// take dom-core.html and munge the generated headers into it
function mungeWithW3C (headers) {
    jsdom.env({
        html:   headers
    ,   done:   function (err, window) {
            if (err) error(err);
            var w3Doc = window.document
            ,   coreSrc = rfs(rel("dom-core.html"))
            ;
            jsdom.env({
                html:   coreSrc
            ,   done:   function (err, window) {
                    if (err) error(err);
                    var coreDoc = window.document
                    ,   rsHead = w3Doc.querySelector("head")
                    ,   targetHead = coreDoc.querySelector("head")
                    ,   rsDiv = w3Doc.querySelector("div.head")
                    ,   targetDiv = coreDoc.querySelector("div.head")
                    ,   sotd = w3Doc.getElementById("sotd")
                    ,   toc = coreDoc.getElementById("table-of-contents")
                    ,   scripts = coreDoc.querySelectorAll("script")
                    ,   imp = function (n) { return coreDoc.importNode(n, true); }
                    ;
                    targetHead.parentNode.replaceChild(imp(rsHead), targetHead);
                    targetDiv.parentNode.replaceChild(imp(rsDiv), targetDiv);
                    for (var i = 0, n = scripts.length; i < n; i++) {
                        var scr = scripts[i];
                        scr.parentNode.removeChild(scr);
                    }
                    toc.parentNode.insertBefore(imp(sotd), toc);

                    var subtitle = coreDoc.getElementById("subtitle");
                    subtitle.innerHTML = "Snapshot specification for the <a href='http://dom.spec.whatwg.org/'>DOM Living Standard</a>";

                    fs.writeFileSync(rel("index.html"), coreDoc.outerHTML);
                }
            });
        }
    });
}

// make a document that can generate nice headers
for (var k in localConfig) respecConfig[k] = localConfig[k];
var respecSource = rfs(rel("header-maker.html"))
                        .replace("###CONFIG###", JSON.stringify(respecConfig, null, 4))
,   doc = jsdom.jsdom(respecSource)
,   win = doc.parentWindow
;
win.onload = function () {
    win.respecEvents.sub("end-all", function () {
        // XXX note that this will break with ReSpec 3.2, but that's an easy fix
        var headersSource = (new win.berjon.respec()).toString();
        // console.log(headersSource);
        mungeWithW3C(headersSource);
    });
};
