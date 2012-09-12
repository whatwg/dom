ANOLIS = anolis

all: dom-core.html data/xrefs/dom/dom.json

data/xrefs/dom/dom.json: Overview.src.html Makefile
	$(ANOLIS) --dump-xrefs=$@ $< /tmp/spec

dom-core.html: Overview.src.html data Makefile
	$(ANOLIS) --omit-optional-tags --quote-attr-values \
	--w3c-compat-xref-a-placement --enable=xspecxref --enable=refs \
	--filter=".publish, .w3conly, title + style" $< $@
