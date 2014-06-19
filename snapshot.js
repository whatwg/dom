
var fs = require("fs")
,   pth = require("path")
,   tmp = require("tmp")
,   exec = require("child_process").exec
,   rfs = function (f) { return fs.readFileSync(f, { encoding: "utf8" }); }
,   wfs = function (f, data) { return fs.writeFileSync(f, data, { encoding: "utf8" }); }
,   rel = function (f) { return pth.join(__dirname, f); }
,   error = function (e) { console.error(e); process.exit(1); }
,   runRSFile = rel("run-respec.phjs")
,   localFile = rel("local-config.json") // use this file to override the config
,   localConfig = fs.existsSync(localFile) ? JSON.parse(rfs(localFile)) : {}
,   outputFile = rel(process.argv[2] || localConfig.output || "index.html")
,   respecConfig = {
        specStatus:     "ED"
    ,   shortName:      "dom"
    // ,   subtitle:       "XXX"
    ,   noReSpecCSS:    true
    ,   bugTracker: {
            "new":  "https://www.w3.org/Bugs/Public/enter_bug.cgi?product=WebAppsWG&amp;component=DOM"
        ,   open:   "https://www.w3.org/Bugs/Public/buglist.cgi?product=WebAppsWG&amp;component=DOM&amp;resolution=---"
        }
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
    ,   wgPublicList:   "www-dom"
    ,   wgPatentURI:    "http://www.w3.org/2004/01/pp-impl/40318/status"
    ,   edDraftURI:     "http://w3c.github.io/dom/"
    ,   license:        "cc-by"
    }
,   references = {}
;


// // make a document that can generate nice headers
for (var k in localConfig) respecConfig[k] = localConfig[k];
var respecSource = rfs(rel("header-maker.html"))
                        .replace("###CONFIG###", JSON.stringify(respecConfig, null, 4))
;

// prepare the reference overrides
fs.readdirSync(rel("references")).forEach(function (f) {
    if (!/\.html$/.test(f)) return;
    references[f.replace(/\.html$/, "")] = rfs(rel("references/" + f));
});


tmp.file({ postfix: ".html" }, function (err, path) {
    if (err) error(err);
    wfs(path, respecSource);
    exec("phantomjs " + runRSFile + " " + path, function (err, stdout, stderr) {
        if (err) throw "Error running PhantomJS script: " + (stderr || err || "unknown error");
        var data = JSON.parse(stdout)
        ,   domSrc = rfs("dom-core.html")
                        .replace(/<meta charset[^]*?<div/im, "<head>\n" + data.head + "\n</head>\n<div")
                        .replace(/<div class="head">[^]*?<\/div>/im, "<div class='head'>" + data.divHead + "</div>")
                        .replace(/<script[^]*?<\/script>/mig, "")
                        .replace(/(<h2[^><]+id="table-of-contents)/i, data.sotd + "\n\n" + "$1")
        ;
        
        for (var ref in references) {
            var rex = new RegExp("<dt id=\"refs" + ref + "\">\\[" + ref + "\\]\\n<dd>.*?\\n");
            domSrc = domSrc.replace(rex, "<dt id=\"refs" + ref + "\">[" + ref + "]\n" + references[ref]);
        }

        // turn XXX into simple warnings
        domSrc = domSrc.replace(/class="XXX"/g, "class='warning'");
        // soften the warnings a little bit

        // domSrc = domSrc.replace("<p class='warning'><code><a href=\"#domerror\">DOMError</a></code>"
        //                     ,   "<p class='warning'><code><a href=\"#domerror\">DOMError</a></code> is defined here but only used in other specifications. <code><a href=\"#domerror\">DOMError</a></code>");
        // domSrc = domSrc.replace("<code><a href=\"#domerror\">DOMError</a></code> will go away."
        //                     ,   "<code><a href=\"#domerror\">DOMError</a></code> will be phased out.");
        // domSrc = domSrc.replace("<code><a href=\"#domerror\">DOMError</a></code> will be nuked"
        //                     ,   "<code><a href=\"#domerror\">DOMError</a></code> will be phased out");

        console.log("Writing " + outputFile);
        wfs(outputFile, domSrc);
    });
});

// output

// XXX need to run this in the Phantom page?
// win.onload = function () {
//     win.respecEvents.sub("end-all", function () {
//         win.require(["core/ui", "ui/save-html"], function (ui, saver) {
//             saver.show(ui, win.respecConfig, win.document, win.respecEvents);
//             mungeWithW3C(saver.toString());
//         });
//     });
// };
