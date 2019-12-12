#!/usr/bin/env python2
import io
import os
from lxml import html
from shutil import copyfile


def main():
    DIR = os.environ["DIR"]
    if "review-drafts" not in DIR:
        return
    specFilename = os.path.join(DIR, "index.html")
    w3cFilename = "w3c-status.html"
    specFile = io.open(specFilename, 'r+', encoding='utf-8')
    w3cFile = io.open(w3cFilename, 'r+', encoding='utf-8')
    doc = html.parse(io.StringIO(unicode(specFile.read())))
    w3c = html.fragments_fromstring(unicode(w3cFile.read()))
    logo = w3c[0]
    title = w3c[1]
    subtitle = w3c[2]
    summaryText = w3c[3].text
    firstParagraph = w3c[4]
    ipr = w3c[5]
    copyright = w3c[6]
    status = w3c[7]
    head = doc.xpath("/html/head")[0]
    head.replace(doc.xpath("/html/head/title")[0], title)
    hgroup = doc.xpath("//hgroup")[0]
    hgroup.replace(doc.xpath("//h2[@id='subtitle']")[0], subtitle)
    annoyingWarning = doc.xpath("(//body/div[@class='head']/" +
                                "details[@class='annoying-warning'])")[0]
    annoyingWarning.attrib['style'] = 'background-color: yellow;' + \
        ' color: black !important; text-shadow: none'
    summary = doc.xpath("(//body/div[@class='head']/" +
                        "details[@class='annoying-warning']/summary)")[0]
    summary.text = summaryText
    links = doc.xpath("(//body/div[@class='head']/" +
                      "details[@class='annoying-warning']//a)")
    for link in links:
        link.attrib['style'] = 'color: black !important'
    logoParagraph = doc.xpath("//body/div[@class='head']/p")[0]
    logoParagraph.append(logo)
    firstParagraph = doc.xpath("(//body/div[@class='head']/" +
                               "details[@class='annoying-warning']/p)[1]")
    annoyingWarning.replace(firstParagraph[0], w3c[4])
    iprParagraph = doc.xpath("(//body/div[@class='head']/" +
                             "details[@class='annoying-warning']/p)[2]")[0]
    iprParagraph.append(ipr)
    lastParagraph = doc.xpath("(//body/div[@class='head']/" +
                              "details[@class='annoying-warning']/p)[3]")[0]
    lastParagraph.text = \
        lastParagraph.text.replace("Do not attempt to implement this version" +
                                   " of the standard. ", "")
    paragraphs = doc.xpath("(//body/div[@class='head']/" +
                           "details[@class='annoying-warning']//p)")
    for paragraph in paragraphs:
        paragraph.attrib['style'] = 'text-shadow: none'

    main = doc.xpath("//main")[0]
    main.replace(doc.xpath("//main/p[last()]")[0], copyright)

    body = doc.xpath("//body")[0]
    body.append(status)
    specFile.seek(0)
    specFile.write(unicode(html.tostring(doc)))
    specFile.truncate()
    specFile.close()
    copyfile(specFilename, "index.html")

main()
