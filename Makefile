# http://wiki.whatwg.org/wiki/GitHub#Makefile

ANOLIS = anolis

all: dom-core.html ../xref/xrefs/dom/dom.json

../xref/xrefs/dom/dom.json: Overview.src.html Makefile
	$(ANOLIS) --dump-xrefs=$@ $< /tmp/spec

dom-core.html: Overview.src.html ../xref Makefile
	$(ANOLIS) --omit-optional-tags --quote-attr-values --xref="../xref" \
	--w3c-compat-xref-a-placement --enable=xspecxref --enable=refs \
	--filter=".publish, .w3conly, title + style" $< $@
